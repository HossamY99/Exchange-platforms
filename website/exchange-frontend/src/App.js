import './App.css';
import React,{ useState,useEffect, useCallback } from "react";
import { AppBar } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import Card from '@material-ui/core/Card';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import UserCredentialsDialog from './UserCredentialsDialog/UserCredentialsDialog.js';
import { getUserToken, saveUserToken } from "./localStorage";
//import { getsellbuy, savesellbuy } from "./localStorage";
import { DataGrid, GridRowsProp, GridColDef} from '@material-ui/data-grid';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { Line } from 'react-chartjs-2';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import Trade from './Trade';
import Graph from './Graph';
import Transact from './Transact';
import Balance from './Balance';
import SplitButton from 'react-bootstrap/SplitButton';

import { DropdownMenu, MenuItem } from 'react-bootstrap-dropdown-menu';


/* udate span */
var SERVER_URL = "http://127.0.0.1:5000";
function App() {

let [userToken, setUserToken] = useState(getUserToken()); 
let [newalert, setnewalert] = useState(0);
let [alerttext, setalerttext] = useState([""]);
let [title, settitle] = useState("Login/reg");
let [buttontext, setbuttontext] = useState("Login/reg");


let [buyUsdRate, setBuyUsdRate] = useState(null);
let [sellUsdRate, setSellUsdRate] = useState(null);


var sr=sellUsdRate;

 useEffect(fetchRates,[]);

 const States = {
   PENDING: "PENDING",
   USER_CREATION: "USER_CREATION",
   USER_LOG_IN: "USER_LOG_IN",
   USER_AUTHENTICATED: "USER_AUTHENTICATED",
  };
  let [authState, setAuthState] = useState(States.PENDING);
  useEffect(titlebutton, [authState]);

  function fetchRates() {
    fetch(`${SERVER_URL}/exchangeRate`)
    .then(response => response.json())
    .then(data => {
      setSellUsdRate(SellUsdRate=>data.usd_to_lbp);  
      setBuyUsdRate(BuyUsdRate=>data.lbp_to_usd);
      sr=data.usd_to_lbp;
      console.log("heres st"+sr);
      console.log("data: ",data);
      //console.log(d1);
      //console.log(d2);
        //console.log(data.lbp_to_usd)
    });
    //setBuyUsdRate(e=>d1);
 
    //setSellUsdRate(e=>d2);
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

function titlebutton(){
 
  if(authState=="USER_CREATION")
    
  {
    settitle("Registration");
    setbuttontext("Register");    
//    return true;
    }
    else if (authState=="USER_LOG_IN")
    {
      settitle("Login");
      setbuttontext("Login");    
   // return true;

    }
}



function checkauthreg()
{
  if(authState=="USER_CREATION")
    
  { 
    return true;
    }
    else if (authState=="USER_LOG_IN")
    { 
    return true;

    }
  else {return false;}
}

function makepending(){
  setAuthState(States.PENDING);
  return true;
}
function checklogreg(username,password){
  if (authState=="USER_CREATION")
  {createUser(username,password);
  
  }
  else if(authState=="USER_LOG_IN")
  { login(username,password); }
  else
  {
  }
}

function logout() {
  //console.log(userToken.toString());
  saveUserToken("logged-out");
  console.log("user get",getUserToken());
  setUserToken("logged-out");
 }
 

  return (
    <Router>
    <div className="App">


<UserCredentialsDialog
    open= {checkauthreg()}
    onSubmit={(username,password) => checklogreg(username,password)}
    title={title}
    submitText={buttontext}
    onClose ={() => setAuthState(States.PENDING) }
    />

<Snackbar
 elevation={6}
 variant="filled"
 open={authState === States.USER_AUTHENTICATED}
 autoHideDuration={2000}
 onClose={() => setAuthState(States.PENDING)}
>
 <Alert severity="success">Success</Alert>
</Snackbar>


<Snackbar
 elevation={6}
 variant="filled"
 open={checkalert()}
 autoHideDuration={2000}
 onClose={() => setnewalert(0)}
>
 <Alert severity="error">{alerttext}</Alert>
</Snackbar>



    <AppBar position="static">
      <Toolbar classes={{ root: "nav" }}>
      
      <a href="http://localhost:3000/" style={{ flex: 1 }} className="linktext">Home</a>
        <Typography variant="h5"  style={{ flex: 1 }}> LBP Exchange Rate </Typography>
        
        
       
          <div >
          {userToken !== "logged-out"  ? (
        
            <Button color="inherit" onClick={logout}>
            Logout
            </Button>
            ) : (
            <div className="makein">
            <Button
            color="inherit"
            onClick={() => setAuthState(States.USER_CREATION)}
            >
            Register
            </Button>
            <Button
            color="inherit"
            onClick={() => setAuthState(States.USER_LOG_IN)}
            >
            Login
            </Button>
            
            </div>
            )}

        
        <div className="dropdown">
            <Button color="inherit" class="dropbtn">▼</Button>
            <div className="dropdown-content">
                   <a href="/balance">Balance</a>
                   <a href="/graph">Graph</a>
                   <a href="/trade">Trades</a>
                   
            </div>
          </div>

      </div>
           
      </Toolbar>
    </AppBar>

<Switch>

  <Route exact path="/"> 
  <Transact ut={userToken} authState={authState} jp= {updatestate} setAuthState={()=>setAuthState} States={States}  />    
</Route>

<Route exact path="/trade"> 
<Trade ut={userToken} />
</Route>  

<Route exact path="/graph"> 
<Graph ut={userToken} sellrate={sr} buyrate={buyUsdRate} />
</Route>  

<Route exact path="/balance"> 
{userToken!=="logged-out"?(
<Balance  ut={userToken} authState={authState} sellrate={sr} jp= {updatestate} setAuthState={()=>setAuthState} States={States}  />
): (<Balance ut={userToken} sellrate={sr} authState={authState} jp= {updatestate} setAuthState={()=>setAuthState} States={States}  /> )}
</Route>







</Switch>   
   
    </div>
    </Router>
  

  );

function updatestate()
{
  setAuthState(States.USER_LOG_IN);
}

function updateandret(){
  setalerttext("Must login first");
  setnewalert(1);
}


function login(username, password) {
  return fetch(`${SERVER_URL}/authentication`, {
  method: "POST",
  headers: {
  "Content-Type": "application/json",
  },
  body: JSON.stringify({
  user_name: username,
  password: password,
  }),
  })
  .then((response) => response.json())
  .then((body) => {
  setAuthState(States.USER_AUTHENTICATED);
  setUserToken(body.token);
  saveUserToken(body.token);
  console.log(body.token);
  console.log(userToken);
  console.log(getUserToken());

  });
  }

  function createUser(username, password) {
    return fetch(`${SERVER_URL}/user`, {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({
    user_name: username,
    password: password,
    }),
    }).then((response) => login(username, password));
    } 



}

export default App;
