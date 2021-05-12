import React,{ useState,useEffect, useCallback } from "react";
import { getUserToken, saveUserToken } from "./localStorage";
import Typography from "@material-ui/core/Typography";
import { DataGrid, GridRowsProp, GridColDef} from '@material-ui/data-grid';
import { Line } from 'react-chartjs-2';
import Alert from '@material-ui/lab/Alert';
//import { getsellbuy, savesellbuy } from "./localStorage";
import Button from '@material-ui/core/Button';

import Snackbar from '@material-ui/core/Snackbar';

var SERVER_URL = "http://127.0.0.1:5000";

const Transact = (props) =>{
 
let [buyUsdRate, setBuyUsdRate] = useState(null);
 let [sellUsdRate, setSellUsdRate] = useState(null);
 let [lbpInput, setLbpInput] = useState("");
 let [usdInput, setUsdInput] = useState("");
 let [convertamount, setconvertamount] = useState("");
 let [convertoutput, setconvertoutput] = useState("");
 let [transactionType, setTransactionType] = useState("usd-to-lbp");
 let [converttype, setconverttype] = useState("to-lbp");
 let [ER, setERused] = useState("buy-rate");
 let [dbused, setdbused] = useState("4");
 let [bclicked, setbclicked] = useState(0);
 let [userToken, setUserToken] = useState(getUserToken());
 let [userTransactions, setUserTransactions] = useState([]);

let [newalert, setnewalert] = useState(0);
let [newsuccalert, setnewsuccalert] = useState(0);
let [alerttext, setalerttext] = useState([""]);

 
 
 useEffect(fetchRates, [bclicked]);
 const fetchUserTransactions = useCallback(() => {
    fetch(`${SERVER_URL}/transaction`, {
    headers: {
    Authorization: `bearer ${props.ut}`,
    },
    })
    .then((response) => response.json())
    .then((transactions) => setUserTransactions(transactions));
    }, [props.ut]);
    useEffect(() => {
    if (props.ut) {
    fetchUserTransactions();
    }
    }, [fetchUserTransactions, props.ut]);
  

   //let [authState, setAuthState] = useState(States.PENDING);
   
  var transbool=true;
  var lbpamnt=0;
  var usdamnt=0;
  var inps={};
  var d1=0;
  var d2=0;


  
function rateinfo(){

    return(

        
<div className="wrapper">
        <h2>Today's Exchange Rate</h2>
        <p>LBP to USD Exchange Rate</p>
        <h3>Buy USD: <span id="buy-usd-rate" >{buyUsdRate} LL</span></h3>
        <h3>Sell USD: <span id="sell-usd-rate" >{sellUsdRate} LL</span></h3>
        <hr />
        
        <div className="Calculator"> 
            <div className="inline"> 
            <label htmlFor="convertinput">Amount {inputsign()}</label>  
            <input id="convertinput" type="number" className="smaller-input" value={convertamount} onChange={e =>setconvertamount(e.target.value)}/>
            </div>
            
            <div className="inline">
            <label htmlFor="convert-to">Convert to: {outputsign()}</label>
            <select id="convert-to" onChange={e =>setconverttype(e.target.value)}> 
                    <option value="to-lbp">To LBP</option >
                    <option value="to-usd">To USD</option>
            </select>
            </div>
            
            <div className="inline">
            <label htmlFor="ER">At Exchange Rate:</label>
            <select id="ER" onChange={e =>setERused(e.target.value)}> 
                    <option value="buy-rate">Buy usd rate</option >
                    <option value="sell-rate">Sell usd rate</option>
            </select>
            </div>
           
            <div className="inline">
            <button id="add-button" className="tabutton" type="button"  onClick={convert}>Convert</button>
            </div>

            <div className="inline">
              <h2 className="outputpar"> {convertoutput} {outputsign()} </h2>
            </div>
            
           
        
        
        </div>



      
    </div>
    
    );
}


    return(
    
    <div className="transact">


<Snackbar
 elevation={6}
 variant="filled"
 open={newalert}
 autoHideDuration={2000}
 onClose={() => setnewalert(0)}
>
 <Alert severity="error">{alerttext}</Alert>
</Snackbar>

<Snackbar
 elevation={6}
 variant="filled"
 open={newsuccalert}
 autoHideDuration={2000}
 onClose={() => setnewsuccalert(0)}
>
 <Alert severity="success">{alerttext}</Alert>
</Snackbar>



<div className="wrapper">
        <h2>Today's Exchange Rate</h2>
        <p>LBP to USD Exchange Rate</p>
        <h3>Buy USD: <span id="buy-usd-rate" >{buyUsdRate} LL</span></h3>
        <h3>Sell USD: <span id="sell-usd-rate" >{sellUsdRate} LL</span></h3>
        <hr />
        
        <div className="Calculator"> 
            <div className="inline"> 
            <label htmlFor="convertinput">Amount {inputsign()}</label>  
            <input id="convertinput" type="number" className="smaller-input" value={convertamount} onChange={e =>setconvertamount(e.target.value)}/>
            </div>
            
            <div className="inline">
            <label htmlFor="convert-to">Convert to: {outputsign()}</label>
            <select id="convert-to" onChange={e =>setconverttype(e.target.value)}> 
                    <option value="to-lbp">To LBP</option >
                    <option value="to-usd">To USD</option>
            </select>
            </div>
            
            <div className="inline">
            <label htmlFor="ER">At Exchange Rate:</label>
            <select id="ER" onChange={e =>setERused(e.target.value)}> 
                    <option value="buy-rate">Buy usd rate</option >
                    <option value="sell-rate">Sell usd rate</option>
            </select>
            </div>
           
            <div className="inline">
            <button id="add-button" className="tabutton" type="button"  onClick={convert}>Convert</button>
            </div>

            <div className="inline">
              <h2 className="outputpar"> {convertoutput} {outputsign()} </h2>
            </div>
            
           
        
        
        </div>



      
    </div>
    


        

    <div className="wrapper">
      
    <h2>Record a recent transaction</h2>
        <form name="transaction-entry">
            <div className="amount-input">
                <label htmlFor="lbp-amount">LBP Amount</label>
                <input id="lbp-amount" type="number" value={lbpInput} onChange={e =>setLbpInput(e.target.value)}/>
               {/*   <input id="lbp-amount" type="number" />  */}
               </div>

               <div className="amount-input">
                <label htmlFor="usd-amount">USD Amount</label>
                <input id="usd-amount" type="number" value={usdInput} onChange={e =>setUsdInput(e.target.value)}/>
                {/* <input id="usd-amount" type="number" /> */}
               </div>

               {/*  <select id="transaction-type"> */}

                <select id="transactionType" onChange={e =>setTransactionType(e.target.value)}> 
                <option value="usd-to-lbp">USD to LBP</option >
                <option value="lbp-to-usd">LBP to USD</option>
               </select>
               <button id="add-button" className="tabutton" type="button"  onClick={addItem}>Add</button>
        </form>



    </div>


    
  


    {(props.ut!=="logged-out"&& props.ut!==null) && (
        <div className="wrapper">
        <Typography variant="h5">Your Transactions</Typography>
        <DataGrid

        columns={[{ field: 'user_id',width:100 }, { field: 'lbp_amount',width:150 }, { field: 'usd_amount',width:140 }, { field: 'usd_to_lbp',width:150 },{ field: 'added_date',width:200,resizable:true }]}
        rows={userTransactions}
        autoHeight
        />
        </div>
        )}



        

        </div>
    );



   
   

    function convert(){
        console.log("here");
       
        if (converttype=="to-lbp")
        {
            if (ER=="buy-rate"){
              let num=(buyUsdRate*convertamount);
              setconvertoutput( num.toFixed(2));
            }
            else if(ER=="sell-rate")
            {
             // getgraphdata();
              console.log("here");
              let num=(sellUsdRate*convertamount);
              setconvertoutput( num.toFixed(2));
            }
        }
    
        else if (converttype=="to-usd"){
            if (ER=="buy-rate"){
              let num=(1/buyUsdRate)*convertamount;
              setconvertoutput( num.toFixed(2));
            }
            else if(ER=="sell-rate")
            {
              let num=(1/sellUsdRate)*convertamount;
              setconvertoutput( num.toFixed(2));
            }
    
        }
    
      }
    
     function inputsign()
    {
      if (converttype=="to-lbp")
      {
        
       // getgraph();
        return "$";}
      else{
        //getgraphdata();
        return "LL";
      }
    
    }
    function outputsign()
    {
      
      if (converttype=="to-lbp")
      {return "LL";}
      else{
        return "$";
      }
    
    
    }

    

    
  function fetchRates() {
    fetch(`${SERVER_URL}/exchangeRate`)
    .then(response => response.json())
    .then(data => {
      d1=data.usd_to_lbp;
      d2=data.lbp_to_usd;
      setBuyUsdRate(buyUsdRate=>data.lbp_to_usd);  
      setSellUsdRate(sellUsdRate=>data.usd_to_lbp);
      console.log("data: ",data);
      //console.log(d1);
      //console.log(d2);
        //console.log(data.lbp_to_usd)
    });
    //setBuyUsdRate(e=>d1);
 
    //setSellUsdRate(e=>d2);
   }
   
      
function addItem() {
   
  console.log(bclicked);
  //transtype=trans.value;
  if (transactionType=="usd-to-lbp")
  {
      transbool=true;
  }
  else{
      transbool=false;
  }
//console.log(transbool);

  lbpamnt=lbpInput;
  usdamnt=usdInput;

  if (lbpamnt == "" || usdamnt == "")
  {
      alert("Please Fill All Required Fields");
  }

  else if (lbpamnt <= 0|| usdamnt <= 0)
  {
      //alert("Can't be negative or zero");
      setalerttext("Can't be negative or zero");
      setnewalert(1);
  }
  else{

      inps = { "usd_amount": usdamnt,
      "lbp_amount":lbpamnt,
      "usd_to_lbp":transbool };
      console.log(JSON.stringify(inps))


      if (props.ut!=="logged-out"&& props.ut!==null)
      { 
        fetch(`${SERVER_URL}/transaction`, {
          method: 'POST', // or 'PUT'
          headers: {
            'Authorization': 'Bearer ' + props.ut,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inps),
        }).then(response => {//console.log(response);
          //setbclicked(e=>e+1);
          console.log(bclicked);
          fetchRates();
          setalerttext("Added With id");
          setnewsuccalert(1);
          console.log("Success with user id");
          fetchUserTransactions();
        })
        
      }
      
    else{
        fetch(`${SERVER_URL}/transaction`, {
            method: 'POST', // or 'PUT'
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(inps),
          }).then(response => {//console.log(response);
            fetchRates();
            //setbclicked(e=>e+1);
            //console.log(bclicked);
            setalerttext("Added without id");
            setnewsuccalert(1);
            console.log("Success without user id");
          })
          
    }
  
  
  }

  
        //console.log(data.lbp_to_usd)
  
  //window.location.reload(false);
}




    

}
export default Transact;