'use strict'


 var swiper = new Swiper('.swiper-container', {
          slidesPerView: 3,
          spaceBetween: 1,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          autoplay:{
              delay: 2500,
            //   disableOnInteraction:false
          },
        });
//         let tradeB;
//         let AnalyticB;
//         let About;
// if(localStorage.getItem("tradeB")){
// tradeB=localStorage.getItem("tradeB")
// }else{
//   tradeB=false;
// }
// if(localStorage.getItem("AnalyticB")){
//   AnalyticB=localStorage.getItem("AnalyticB")
//   }else{
//     AnalyticB=false;
//   }

// if(tradeB){
// $("#tradeSide").removeClass()
// .addClass("tradeSelected") 
// }else{
//   $("#tradeSide").removeClass()
// }
// if(){


// }
if( window.location.pathname=="/trade"){
  $("#tradeSide").removeClass()
  .addClass("tradeSelected") 
}else if(  window.location.pathname=="/analytics"){
  $("#analayticsS").removeClass()
  .addClass("AnSelected") 
}
else if( window.location.pathname=="/about"){

  $("#aboutSide").removeClass()
  .addClass("AbSelected") 

}
        $("#tradeSide").on( "click", ()=>{
          
          // tradeB=true;
          // AnalyticB=false;
          // About=false
          // localStorage.setItem("tradeB",tradeB)
          // localStorage.setItem("tradeB",AnalyticB)
          // localStorage.setItem("tradeB",About)


          if( window.location.pathname=="/trade"){
            alert("You Are In The Trade Page")
          }else{
            window.location.replace("/trade");
          }
        }) 
        $("#analayticsS").on( "click", ()=>{
                  
          // tradeB=false;
          // AnalyticB=true;
          // About=false
          // localStorage.setItem("tradeB",tradeB)
          // localStorage.setItem("tradeB",AnalyticB)
          // localStorage.setItem("tradeB",About)
          // window.location.replace("/");
          if( window.location.pathname=="/analytics"){
            alert("You Are In The Analytics Page")
          }else{
            window.location.replace("/analytics");
          }


        }) 
        $("#aboutSide").on( "click", ()=>{
          // tradeB=false;
          // AnalyticB=false;
          // About=true
          // localStorage.setItem("tradeB",tradeB)
          // localStorage.setItem("tradeB",AnalyticB)
          // localStorage.setItem("tradeB",About)
          if( window.location.pathname=="/about"){
            alert("You Are In The About Page")
          }else{
            window.location.replace("/about");
          }

        }) 