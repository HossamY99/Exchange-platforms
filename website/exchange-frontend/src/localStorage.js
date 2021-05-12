


export function saveUserToken(userToken) {
    localStorage.setItem("TOKEN", userToken);
   }
   export function getUserToken() {
    return localStorage.getItem("TOKEN");
   }
   
   /*
   export function savesellbuy(sell,buy) {
    localStorage.setItem("sell", sell);
    localStorage.setItem("buy", buy);
   }
   export function getsellbuy() {
    return [localStorage.getItem("sell"),localStorage.getItem("buy")];
   }
   */

