import React,{ useState,useEffect, useCallback } from "react";
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
//import { getsellbuy, savesellbuy } from "./localStorage";

import Snackbar from '@material-ui/core/Snackbar';

import Depw from './depw/depw.js';
var SERVER_URL = "http://127.0.0.1:5000";

const Balance = (props) =>{
    var sg=props.sg;
    
    console.log("props"+props.sellrate);
    
  
    let [usertrades, setusertrades] = useState([]);
    let [alerthere, setalerthere] = useState([0]);
    let [bclicked, setbclicked] = useState(0);
    
    let [tradeusdInput, settradeUsdInput] = useState("");
    let [traderate, settraderate] = useState("");
    let [tradetype, settradetype] = useState("");
    

    let [title, settitle] = useState ("aa");
    let [buttontext, setbuttontext] = useState ("bb");

    
    let [usdbalance, setusdbalance] = useState("");
    let [lbpbalance, setlbpbalance] = useState("");
    let [total, settotal] = useState("");

    let [toopen, settoopen] = useState(0);
    let [toopenw, settoopenw] = useState(0);

    
let [buyUsdRate, setBuyUsdRate] = useState(null);
let [sellUsdRate, setSellUsdRate] = useState(null);


    let [newalert, setnewalert] = useState(0);
    let [newsuccalert, setnewsuccalert] = useState(0);
    let [alerttext, setalerttext] = useState([""]);

    
    //useEffect(updatebalance, []);

    useEffect(updatetotal, []);
    useEffect(updatebalance, [sellUsdRate]);
    useEffect(fetchRates, []);
    useEffect(updatebalance, [props.ut]);
    //useEffect(, [props.ut]);

    var sellrate=parseFloat(props.sellrate);
    
    var old=parseFloat(props.sellrate);
  
  const fetchusertrades = useCallback(() => {
    fetch(`${SERVER_URL}/yourtrades`, {
    method: 'POST', // or 'PUT'
    headers: {
      'Authorization': 'Bearer ' + props.ut,
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
  

    function usd(){
  
       return usdbalance.toString+" $";
     
    }

    function updatetotal()
    {
      console.log("heres rrr:"+sellUsdRate);
      //setbclicked(1);
      //setSellUsdRate(props.sellrate);
    }
    function lbp(){
        return (lbpbalance.toString+" $").toString;
    }
   

    return(
        <div className="login">
      
    
      {(props.ut!=="logged-out"&& props.ut!==null) && (

<div >
<h1>Balance: </h1>

        



             <div class="wrapperalt">
      <div class="boxb">
          
      <div className="todisp">
        <label for="fname" className="colinput">USD Balance: $</label>
             <h1 className="colinput">{usdbalance} $</h1>
        </div>
        <div className="todisp">
        <label for="lname" className="colinput">LBP Balance: LL</label>
        <h1 className="colinput">{lbpbalance} LL</h1>
        
             </div>

        <div className="todisp">
        <label for="lname" className="colinput">Total in usd=: </label>
        <h1 className="colinput">{total} $</h1>
        
             </div>

        
          
      </div>
    </div>

    <br></br>

    <button className="balbutton" onClick={open} >Deposit</button>
    <button className="balbutton" onClick={openw} >Withdraw</button>

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



    <Depw
    open= {checkauthreg()}
    onSubmit={(usdi,lbpi) => dep(usdi,lbpi)}
    title="Deposit"
    submitText="Deposit"
    onClose ={() => settoopen(0) }
    />
    
    
    <Depw
    open= {checkw()}
    onSubmit={(usdi,lbpi) => withdr(usdi,lbpi)}
    title="Withdraw"
    submitText="Withdraw"
    onClose ={() => settoopenw(0) }
    />

    <br></br>
    <br></br>
    </div>
      )}

            
                <br></br><br></br><br></br>
            {props.ut=="logged-out" && props.jp() }
            
                {props.ut!=="logged-out" && <h2>Pending Trades: </h2>}                  
            {props.ut!=="logged-out" && showtrades()}

            { (alerthere.toString()).startsWith("Can not") ?(
            <Alert severity="error">{alerthere}</Alert>
            ) : (<br></br>) }

            { (alerthere.toString()).startsWith("Not enough") ?(
            <Alert severity="error">{alerthere}</Alert>
            ) : (<br></br>) }




        
        </div>
    );

    function checklogreg(usdi,lbpi){
      return true;    }
    
      function checkauthreg(){

       if (toopen==1)
        {return true;}
        else{
          return false;
        }
      
      }

      function checksuccalert(){
        if (toopen==1)
         {return true;}
         else{
           return false;
         }
       
       }
 

      
function checkalert(){

  if (newalert!==0)
  {
    return true;
    setnewalert(0);
  }
  else{
    return false;
  }

}

      function checkw(){
        if (toopenw==1)
         {return true;}
         else{
           return false;
         }
       
       }
      

    function dep(usdi,lbpi)
    {
      usdi=parseFloat(usdi);
      lbpi=parseFloat(lbpi);

      if (props.ut!=="logged-out"&& props.ut!==null)
      { 
        if (usdi<0||lbpi<0)
        {
          setalerttext("Cant be negative");
          setnewalert(1);
//          alert("cant be negative.")
        }
        else{
      var tdep={"usd_amount":usdi,
      "lbp_amount":lbpi,
      "increase":true};

      console.log("tdep");
      fetch(`${SERVER_URL}/user/balance`, {
        method: 'PUT', // or 'PUT'
        headers: {
          'Authorization': 'Bearer ' + props.ut,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tdep),

      }) .then(response => response.json())
        .then(data => {
    //      d1=data.usd_balance;
     //     d2=data.lbp_balance;
          //setlbpbalance(data.lbp_balance);
          //setusdbalance(data.usd_balance);
          //settotal(parseFloat(data.lbp_balance)/10000+parseFloat(data.usd_balance));
        
        console.log("Success with user id");
        setalerttext("Succeeded");
        setnewsuccalert(1);
        updatebalance();
        
      }).catch(error => {
     //     console.log("here");
          console.error('Error:', error);
      });
    
    }
  }
    else{
      console.log(props);
      console.log(props.authState);
      console.log("login first");
      props.jp();
      console.log(props.authState);
    }

    settoopen(0);

    }

    
    function withdr(usdi,lbpi)
    {
      usdi=parseFloat(usdi);
      lbpi=parseFloat(lbpi);

      

      if (props.ut!=="logged-out"&& props.ut!==null)
      { 

        if (usdi<0||lbpi<0)
        {
          setalerttext("Cant be negative");
          setnewalert(1);
//          alert("cant be negative.")
        }
        else{
      var tdep={"usd_amount":usdi,
      "lbp_amount":lbpi,
      "increase":false};

      console.log("tdep");
      fetch(`${SERVER_URL}/user/balance`, {
        method: 'PUT', // or 'PUT'
        headers: {
          'Authorization': 'Bearer ' + props.ut,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tdep),

      }) .then(response => response.json())
        .then(data => {
        if (data.errormsg)
     {console.log(data.errormsg);
  //  setalerthere(data.errormsg);
    setalerttext(data.errormsg);
    setnewalert(1);
    }
    else{
    //      d1=data.usd_balance;
     //     d2=data.lbp_balance;
          //setlbpbalance(data.lbp_balance);
          //setusdbalance(data.usd_balance);
          //settotal(parseFloat(data.lbp_balance)/10000+parseFloat(data.usd_balance));
        
        console.log("Success with user id");
        setalerttext("Succeeded");
        setnewsuccalert(1);
        updatebalance();
    }
      }).catch(error => {
     //     console.log("here");
          console.error('Error:', error);
      });
    
    }
  }
    else{
      console.log(props);
      console.log(props.authState);
      console.log("login first");
      props.jp();
      console.log(props.authState);
    }

    settoopenw(0);

    }

    function getbalance(){
    return (
      <div>
      <h1>Balance: </h1>
    <h2> USD: {usdbalance} $</h2>
    <h2>LBP: {lbpbalance} LL</h2>
    </div>
    )
    
    }
    

    function fetchRates() {
      fetch(`${SERVER_URL}/exchangeRate`)
      .then(response => response.json())
      .then(data => {
        setSellUsdRate(data.usd_to_lbp);  
        setBuyUsdRate(data.lbp_to_usd);
        console.log("data: ",data);
        //console.log(d1);
        //console.log(d2);
          //console.log(data.lbp_to_usd)
      });
      //setBuyUsdRate(e=>d1);
   
      //setSellUsdRate(e=>d2);
     }
  

function maketrade(postid)
{
  console.log(postid);

  var totrade={"trade_id":postid}
  fetch(`${SERVER_URL}/cancelTrade`, {
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
     fetchusertrades();
     updatebalance();
     //getbalance();
    
    }
     else if (data.errormsg)
     {console.log(data.errormsg);
    setalerthere(data.errormsg);
    }
  
  }).catch(error => {
      console.error('Error:', error);
  });
}

function open(){
  settoopen(1);
}


function openw(){
  settoopenw(1);
}

function updatebalance(){
console.log("ss"+props.sellrate);
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
      if (props.sellrate){
      
      settotal(parseFloat((data.lbp_balance)/(props.sellrate) +parseFloat(data.usd_balance)).toFixed(2));
      }
      else{ settotal(parseFloat((data.lbp_balance)/(parseFloat(sellUsdRate)) +parseFloat(data.usd_balance)).toFixed(3));}
    console.log("Success with user id"+props.sellrate);
    
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
        <th>Cancel</th>

        
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
    <td> <button className="tbutton" type="button"  onClick={maketrade.bind(this,post.id)}>Cancel</button> </td>
  
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
      alert("Please Fill All Required Fields");
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
          setalerthere(1);
    
        }
        //setbclicked(e=>e+1);
        //console.log(bclicked);
        //fetchRates();
        console.log("Success with user id");
        fetchusertrades();
      }).catch(error => {
     //     console.log("here");
          console.error('Error:', error);
      });



}
}


    
}


export default Balance;