import React,{ useState,useEffect, useCallback } from "react";
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';


var SERVER_URL = "http://127.0.0.1:5000";

const Trade = (props) =>{
    var sg=props.sg;
    
    console.log(props);
    console.log(props.ut);
    

    let [usertrades, setusertrades] = useState([]);
    let [alerthere, setalerthere] = useState([0]);
    
    let [tradeusdInput, settradeUsdInput] = useState("");
    let [traderate, settraderate] = useState("");
    let [tradetype, settradetype] = useState("");


    
    let [usdbalance, setusdbalance] = useState("");
    let [lbpbalance, setlbpbalance] = useState("");


    let [newalert, setnewalert] = useState(0);
    let [newsuccalert, setnewsuccalert] = useState(0);
    let [alerttext, setalerttext] = useState([""]);




    
  const fetchusertrades = useCallback(() => {
    fetch(`${SERVER_URL}/trades`, {
    headers: {
    Authorization: `bearer ${props.ut}`,
    },
    })
    .then((response) => response.json())
    .then((trades) => setusertrades(trades));
    }, [props.ut]);
    useEffect(() => {
    if (props.ut) {
    fetchusertrades();
    }
    }, [fetchusertrades, props.ut]);
  

   

    return(
        <div className="trade">
        {props.ut!="logged-out" &&(
        <h1>Add a Trade: </h1> )}
        {props.ut!="logged-out"?  addtrade() :(<br></br>) }

        

          

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



            <h1>Trades: </h1>                  
            {showtrades()}

            { (alerthere.toString()).startsWith("Can not") ?(
            <Alert severity="error">{alerthere}</Alert>
            ) : (<br></br>) }

            { (alerthere.toString()).startsWith("Not enough") ?(
            <Alert severity="error">{alerthere}</Alert>
            ) : (<br></br>) }




        
        </div>
    );




    function getbalance(){
      updatebalance();
    return (
      <div>
      <h1>Balance: </h1>
    <h2> USD: {usdbalance} $</h2>
    <h2>LBP: {lbpbalance} LL</h2>
    </div>
    )
    
    }
    


    function addtrade()
{



  return (
    
    <div className="wrapper">
      
    <h2>Add Trade Request</h2>
        <form name="trade-entry" >
            
               <div className="tradeamount-input">
                <label htmlFor="tradeusd-amount">USD Amount</label>
                <input id="tradeusd-amount" type="number" value={tradeusdInput} onChange={e =>settradeUsdInput(e.target.value)}/>
                {/* <input id="usd-amount" type="number" /> */}
               </div>

               <div className="trade-rate">
                <label htmlFor="traderate">Rate</label>
                <input id="traderate" type="number" value={traderate} onChange={e =>settraderate(e.target.value)}/>
               {/*   <input id="lbp-amount" type="number" />  */}
               </div>


               {/*  <select id="transaction-type"> */}
                <br></br>
                <select id="trade-type" onChange={e =>settradetype(e.target.value)}> 
                <option value="0" >Buy</option >
                <option value="1">Sell</option>
               </select>
               <button id="addtrade-button" className="tabutton" type="button"  onClick={addtradereq}>Add Trade</button>
        </form>




    </div>
  

  )
}


function maketrade(postid)
{

  if (props.ut=="logged-out" || props.ut==null)
  {
    setalerttext("You need to login");
    setnewalert(1);
  }

  else{

  console.log(postid);

  var totrade={"trade_id":postid}
  fetch(`${SERVER_URL}/makeTrade`, {
    method: 'POST', // or 'PUT'
    headers: {
      'Authorization': 'Bearer ' + props.ut,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(totrade),
  }).then(response => response.json())
  .then(data => {
    if (data.usd_balance)
     {console.log("successful");
     setalerttext("Successful");
    setnewsuccalert(1);
     fetchusertrades();
     //getbalance();
    
    }
     else if (data.errormsg)
     {console.log(data.errormsg);
  //  setalerthere(data.errormsg);
    setalerttext(data.errormsg);
    setnewalert(1);
    }
  
  }).catch(error => {
      console.error('Error:', error);
  });

}
}




function updatebalance(){
  
  fetch(`${SERVER_URL}/user/balance`, {
    method: 'GET', // or 'PUT'
    headers: {
      'Authorization': 'Bearer ' + props.ut,
    },
  }) .then(response => response.json())
    .then(data => {
//      d1=data.usd_balance;
 //     d2=data.lbp_balance;
      setlbpbalance(data.lbp_balance);
      setusdbalance(data.usd_balance);
    
    console.log("Success with user id");
    
  }).catch(error => {
 //     console.log("here");
      console.error('Error:', error);
  });


}


function showtrades()
{
return (
  <div className="table-wrapper">



<table className="fl-table">
    <thead>
    <tr>
        <th>ID</th>
        <th>User ID</th>
        <th>Rate</th>
        <th>USD Amount</th>
        <th>Type</th>
        <th>Confirm</th>

        
    </tr>
    </thead>
    <tbody>

      {usertrades.map(post=>{ return showtable(post)})}                
    
    </tbody>
    </table>

        


</div>


)
}

function showtable(post)
{
  return (
        
      <tr>  
    <td><h4> {post.id} </h4></td>
    <td><h4> {post.user_id} </h4></td>
    <td> <h4> {post.rate} </h4> </td>
    <td> <h4> {post.usd_amount} </h4> </td>
    {(post.usd_to_lbp)? (<td> <h4> Sell </h4> </td>) 
    : (<td> <h4> Buy </h4> </td>)}
    <td> <button className="tbutton" type="tbutton"  onClick={maketrade.bind(this,post.id)}>Confirm</button> </td>
  
    </tr>
  
    )
 // console.log("shown");

}



function addtradereq()
{
  //console.log(bclicked);
  //transtype=trans.value;

  

  var transbool=true;
  if (tradetype=="1")
  {
       transbool=true;
  }
  else{
      transbool=false;
  }
//console.log(transbool);

  var traderatev=parseFloat(traderate);
  var tradeusdamnt=parseFloat(tradeusdInput);

  if (traderate == "" || tradeusdamnt == "")
  {
      //alert("Please Fill All Required Fields");
      setalerttext("Can't be negative or zero");
      setnewalert(1);
  }
  else if (tradeusdamnt <= 0|| traderate <= 0)
  {
      //alert("Can't be negative or zero");
      setalerttext("Can't be negative or zero");
      setnewalert(1);
  }
  else{

      var tradej = { "usd_amount": tradeusdamnt,
      "rate":traderatev,
      "usd_to_lbp":transbool};
      console.log(JSON.stringify(tradej))

      fetch(`${SERVER_URL}/trades`, {
        method: 'POST', // or 'PUT'
        headers: {
          'Authorization': 'Bearer ' + props.ut,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tradej),
      }).then(response => {
        console.log(response);
        if (!response.ok)
        {
          console.log("Not ok");
          setalerttext("Not enough funds");
          setnewalert(1);
       //   setalerthere(1);
    
        }
        else{
        if (response.json().errormsg)
     {console.log(response.json().errormsg);
  //  setalerthere(data.errormsg);
    }
    else{
  
        //setbclicked(e=>e+1);
        //console.log(bclicked);
        //fetchRates();
        console.log("Success with user id");
        setalerttext("Added");
        setnewsuccalert(1);
    
    }
  }
        fetchusertrades();

      }).catch(error => {
     //     console.log("here");
          console.error('Error:', error);
    
      
        });

    

}

}
    
}


export default Trade;