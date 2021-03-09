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