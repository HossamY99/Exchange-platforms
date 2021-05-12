import React,{ useState,useEffect, useCallback } from "react";
import Alert from '@material-ui/lab/Alert';
import { Line } from 'react-chartjs-2';
import { colors } from "@material-ui/core";
import { getsellbuy, savesellbuy } from "./localStorage";
//import rateinfo from './App';
var SERVER_URL = "http://127.0.0.1:5000";

const Graph = (props) =>{



    let [grapharr, setgrapharr] = useState([[1,1],[1,1]]);
    let [graphsell, setgraphsell] = useState([[1,1],[1,1]]);
    let [showgraph, setshowgraph] = useState(0);
    let [daysback, setdaysback] = useState({"number_of_days_back": 4});
    let [dbused, setdbused] = useState("4");

    let [bbr, setbbr] = useState(['not loaded','not loaded']);
    let [bsr, setbsr] = useState(['not loaded','not loaded']);
    let [sbr, setsbr] = useState(['not loaded','not loaded']);
    let [ssr, setssr] = useState(['not loaded','not loaded']);

    let [custom, setcustom] = useState(null);

    
    let [buying_transaction_biggest_rate, setbuying_transaction_biggest_rate] = useState(['not loaded','not loaded']);
    let [buying_transaction_smallest_rate, setbuying_transaction_smallest_rate] = useState(['not loaded','not loaded']);
    let [largest_transaction, setlargest_transaction] = useState(['not loaded','not loaded']);
    let [selling_transaction_biggest_rate, setselling_transaction_biggest_rate] = useState(['not loaded','not loaded']);
    let [selling_transaction_smallest_rate, setselling_transaction_smallest_rate] = useState(['not loaded','not loaded']);
    
    
    useEffect(checkdays, [dbused]);
    useEffect(getinsights, [dbused]);
    useEffect(gettraninsights, [dbused]);

    
//    <div >
  //  <button id="trade-button" className="button" type="button"  onClick={showthegraph}>Show Graph</button>
 //   </div>


    return(<div>

        <br></br>
        <h1>Graph: </h1>
        <br></br>

       

        <div >
            <label htmlFor="DB">Days back:</label>
            <select id="DB" onChange={e =>setdbused(e.target.value)}> 
                    <option value="4">4 days</option >
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="custom">custom</option>

            </select>
            </div>
           

           {custom &&(
           <div >

           <label htmlFor="tradeusd-amount">Days</label>
                <input id="tradeusd-amount" type="number" value={parseInt(dbused)} onChange={e =>setdbused(e.target.value)}/>
           </div>
           )}


            { ( LineChart())}


            <h1 style={{color:"gray"}}>Rate Insights: </h1>
        


        <div class="wrapperalt">
 <div class="boxrate">
     
 <div className="todisp">
   <label for="fname" className="headline">Biggest Buying rate</label>
        <h2 className="colinput">{parseFloat(bbr[0]).toFixed(2)} LL/$</h2>
        <h4 className="colinput">Date:  {bbr[1]} </h4>
   </div>
   
   <div className="todisp">
   <label for="fname" className="headline">Smallest Buying rate</label>
        <h2 className="colinput">{parseFloat(sbr[0]).toFixed(2)} LL/$</h2>
        <h4 className="colinput">Date:  {sbr[1]} </h4>
   </div>
   
   <div className="todisp">
   <label for="fname" className="headline">Biggest Selling rate</label>
        <h2 className="colinput">{parseFloat(bsr[0]).toFixed(2)} LL/$</h2>
        <h4 className="colinput">Date:  {bsr[1]} </h4>
   </div>
   
   

   <div className="todisp">
   <label for="fname" className="headline">Smallest Selling rate</label>
        <h2 className="colinput">{parseFloat(ssr[0]).toFixed(2)} LL/$</h2>
        <h4 className="colinput">Date:  {ssr[1]} </h4>
   </div>
   

     
 </div>
</div>

<br></br>

<h1 style={{color:"darkgray"}} >Transaction Insights: </h1>

<div class="wrapperalt">
 <div class="boxtr">
     
 <div className="todisp">
   <label for="fname" className="headline">Buying Transaction Biggest Rate</label>

        {(buying_transaction_biggest_rate.usd_to_lbp)? (
        <h4 className="colinput">Type: Sold USD</h4>
        ): <h4 className="colinput">Type: Bought USD</h4>}

        <h4 className="colinput">Usd Amount: {buying_transaction_biggest_rate.usd_amount} $</h4>
        <h4 className="colinput">Lbp Amount: {buying_transaction_biggest_rate.lbp_amount} LL</h4>

        <h4 className="colinput">So rate: {buying_transaction_biggest_rate.lbp_amount/buying_transaction_biggest_rate.usd_amount} LL/$</h4>
            

        <h4 className="colinput">Date:  {buying_transaction_biggest_rate.added_date} </h4>
   </div>


 
   <div className="todisp">
   <label for="fname" className="headline">Buying Transaction Smallest Rate</label>

        {(buying_transaction_smallest_rate.usd_to_lbp)? (
        <h4 className="colinput">Type: Sold USD</h4>
        ): <h4 className="colinput">Type: Bought USD</h4>}

        <h4 className="colinput">Usd Amount: {buying_transaction_smallest_rate.usd_amount} $</h4>
        <h4 className="colinput">Lbp Amount: {buying_transaction_smallest_rate.lbp_amount} LL</h4>
        <h4 className="colinput">So rate: {buying_transaction_smallest_rate.lbp_amount/buying_transaction_smallest_rate.usd_amount} LL/$</h4>
            

        <h4 className="colinput">Date:  {buying_transaction_smallest_rate.added_date} </h4>
   </div>


   <div className="todisp">
   <label for="fname" className="headline">Buying Transaction Biggest Rate</label>

        {(largest_transaction.usd_to_lbp)? (
        <h4 className="colinput">Type: Sold USD</h4>
        ): <h4 className="colinput">Type: Bought USD</h4>}

        <h4 className="colinput">Usd Amount: {largest_transaction.usd_amount} $</h4>
        <h4 className="colinput">Lbp Amount: {largest_transaction.lbp_amount} LL</h4>
            
        <h4 className="colinput">So rate: {largest_transaction.lbp_amount/largest_transaction.usd_amount} LL/$</h4>

        <h4 className="colinput">Date:  {largest_transaction.added_date} </h4>
   </div>


   <div className="todisp">
   <label for="fname" className="headline">Selling Transaction Biggest Rate</label>

        {(selling_transaction_biggest_rate.usd_to_lbp)? (
        <h4 className="colinput">Type: Sold USD</h4>
        ): <h4 className="colinput">Type: Bought USD</h4>}

        <h4 className="colinput">Usd Amount: {selling_transaction_biggest_rate.usd_amount} $</h4>
        <h4 className="colinput">Lbp Amount: {selling_transaction_biggest_rate.lbp_amount} LL</h4>
            
        <h4 className="colinput">So rate: {selling_transaction_biggest_rate.lbp_amount/selling_transaction_biggest_rate.usd_amount} LL/$</h4>
        <h4 className="colinput">Date:  {selling_transaction_biggest_rate.added_date} </h4>
   </div>

   <div className="todisp">
   <label for="fname" className="headline">Selling Transaction Smallest Rate</label>

        {(selling_transaction_smallest_rate.usd_to_lbp)? (
        <h4 className="colinput">Type: Sold USD</h4>
        ): <h4 className="colinput">Type: Bought USD</h4>}

        <h4 className="colinput">Usd Amount: {selling_transaction_smallest_rate.usd_amount} $</h4>
        <h4 className="colinput">Lbp Amount: {selling_transaction_smallest_rate.lbp_amount} LL</h4>

        <h4 className="colinput">So rate: {selling_transaction_smallest_rate.lbp_amount/selling_transaction_smallest_rate.usd_amount} LL/$</h4>
            

        <h4 className="colinput">Date:  {selling_transaction_smallest_rate.added_date} </h4>
   </div>




     
 </div>
</div>






    </div>);


function showthegraph()
{
  if (showgraph==0)
  {
//    setdaysback({"number_of_days_back": 6});
//   getgraphdata();
  getgraphdata();
//  console.log("clicked");
  setshowgraph(1);
  }
  else{
    setshowgraph(0);

  }
}



function checkdays(){
    
  if (dbused!=="custom")
  {
    if (parseInt(dbused)>1000)
    {
    //  console.log("100000000000000000");
      alert("cant accept more than 1000 days back");
    }
    else{
//    console.log("db used"+dbused);
 //   console.log("sr"+props.sellrate);
    // setshowgraph(0);
     setdaysback({"number_of_days_back": parseInt(dbused)});
    var dbb={"number_of_days_back": parseInt(dbused)};

 
    fetch(`${SERVER_URL}/exchangeRate/graph`, {
      
      method: 'POST', // or 'PUT'
      headers: {
        
        'Content-Type': 'application/json',
      },
      //body:daysback,
      //body:JSON.stringify(daysback),
      body:JSON.stringify(dbb),
    }).then((data) => data.json()).then((body) => {
       
      var multibuy=body.buy_rates;
      var multisell=body.sell_rates;
      setgrapharr(multibuy);
      setgraphsell(multisell);
     // setshowgraph(1);
     
      });

    //getgraphdata();
    //setshowgraph(1);

    }

  }

  else{
    setcustom(1);

  }


  }
  



  
  function getgraphdata()
  {


  //  console.log("from graphdata: "+ daysback['number_of_days_back']);

    fetch(`${SERVER_URL}/exchangeRate/graph`, {
    
      method: 'POST', // or 'PUT'
      headers: {
        
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(daysback),
    }).then((data) => data.json()).then((body) => {
       
        var multibuy=body.buy_rates;
        var multisell=body.sell_rates;
        setgrapharr(multibuy);
        setgraphsell(multisell);
     
     
     // for(var i = 0; i < multibuy.length; i++) {
     //   var obj = multibuy[i];
     //   console.log("rate: "+obj[0]);
      //}
      //return multibuy;
      
       // console.log(body.buy_rates[0][0]);
     // }).catch(error => {
      //  console.error('Error:', error);
      //  return [[1,2]];
      });
      


      
  }

  function LineChart () {
   

    var trylabels1=[];
    var trydata1=[];
    var trydata2=[];

    

    var multibuy=[[1,2],[3,4],[5,6]];
    var multisell=[[1,2],[3,4],[5,6]];
//    console.log("how much i printed");
 
  
   

    

//for buyrates

    multibuy=grapharr;
    var i=0;
    var returnedlength=multibuy.length;
    var dused=parseInt(dbused);

    if (returnedlength>dused){
      //  console.log(" returned graph update: was more");
     //   console.log(returnedlength);
        i=returnedlength-dused;
      //  console.log(i);

    }
    else if (returnedlength<dused){
     //   console.log(" returned graph update: was less somehow");
        i=dused-returnedlength;
    }



    var start=0;
    for(i = i; i < multibuy.length; i++) {
      
      var obj = multibuy[i];
     // var tosell=multisell[start];
   
      trydata1[start]=obj[0];
     // trydata2[start]=obj[0];

      trylabels1[start]=(((obj[1]).toString()).substring(0,11) );
      //trylabels1[i]=(((obj[1]).toString()).substring(0,17) );
     // trylabels1[i]=(((new Date(obj[1])).toString()).substring(0,4) );
      //console.log("date: "+obj[1]);
      start+=1;
    }





//for sell rates

var multisell=graphsell;

     i=0;
     returnedlength=multisell.length;
     dused=parseInt(dbused);

    if (returnedlength>dused){
      //  console.log(" returned sell graph update: was more");
        i=returnedlength-dused;

    }
    else if (returnedlength<dused){
      //  console.log(" returned sell graph update: was less somehow");
        i=dused-returnedlength;
    }



    start=0;
    var tosell=[];
    for(i = i; i < multisell.length; i++) {
      
      //var obj = multisell[start];
      tosell=multisell[i];
   
      //trydata1[start]=obj[0];
      trydata2[start]=tosell[0];

      //trylabels1[start]=(((obj[1]).toString()).substring(0,11) );
      //trylabels1[i]=(((obj[1]).toString()).substring(0,17) );
     // trylabels1[i]=(((new Date(obj[1])).toString()).substring(0,4) );
      //console.log("date: "+obj[1]);
      start+=1;
    }


  
    //  console.log("1: "+trydata1.length);
    //  console.log("2: "+trydata2.length);
   //   console.log("3: "+trylabels1.length);

    

    
    const data = {
      labels: trylabels1,
      datasets: [
        {
          label: 'Buy Rates',
          data: trydata1,
          borderColor: ['rgba(255, 206, 86, 0.2)'],
          backgroundColor: ['rgba(255, 206, 86, 0.2)'],
          pointBackgroundColor: 'rgba(255, 206, 86, 0.2)',
          pointBorderColor: 'rgba(255, 206, 86, 0.2)'
        },
        {
          label: 'Sell Rates',
          data: trydata2,
          borderColor: ['rgba(54, 162, 235, 0.2)'],
          backgroundColor: ['rgba(54, 162, 235, 0.2)'],
          pointBackgroundColor: 'rgba(54, 162, 235, 0.2)',
          pointBorderColor: 'rgba(54, 162, 235, 0.2)'
        }
      ]
    }
  
    const options = {
      title: {
        display: true,
        text: 'Rates'
      },
      scales: {
        yAxes: [
          {
            ticks: {
              min: 0,
              max: 21000,
              stepSize: 3000
            }
          }
        ]
      }
    }
  
    return <Line data={data} options={options} />

    
 
  
  }




  function getinsights(){


    fetch(`${SERVER_URL}/exchangeRate/insights?days=${parseInt(dbused)}`, {
      method: 'GET', // or 'PUT'
      headers: {
        
      },
    }) .then(response => response.json())
      .then(data => {
  //      d1=data.usd_balance;
   //     d2=data.lbp_balance;
        //setlbpbalance(data.lbp_balance);
        //setusdbalance(data.usd_balance);
        //settotal(parseFloat(data.lbp_balance)/10000+parseFloat(data.usd_balance));
      
     // console.log(data.biggest_buying_rate);
     // console.log(data.biggest_buying_rate[0]);
      setbbr(data.biggest_buying_rate);
      setbsr(data.biggest_selling_rate);
      setsbr(data.smallest_buying_rate);
      setssr(data.smallest_selling_rate);

      //console.log("Success with user id");
      
    }).catch(error => {
   //     console.log("here");
        console.error('Error:', error);
    });
  
  
  }

  function gettraninsights(){


    fetch(`${SERVER_URL}/transactions/insights?days=${parseInt(dbused)}`, {
      method: 'GET', // or 'PUT'
      headers: {
        
      },
    }) .then(response => response.json())
      .then(data => {
  
      setbuying_transaction_biggest_rate(data.buying_transaction_biggest_rate);
      setbuying_transaction_smallest_rate(data.buying_transaction_smallest_rate);
      setlargest_transaction(data.largest_transaction);
      setselling_transaction_biggest_rate(data.selling_transaction_biggest_rate);
      setselling_transaction_smallest_rate(data.selling_transaction_smallest_rate);

    //  console.log("Success with user id");
      
    }).catch(error => {
   //     console.log("here");
        console.error('Error:', error);
    });
  
  
  }


}

export default Graph;

