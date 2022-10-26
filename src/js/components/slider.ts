import Swiper, { Autoplay, Navigation } from 'swiper';

Swiper.use([Navigation, Autoplay]);

const swiper = new Swiper('.un_slider_wrap', {
  init: false,
  loop: true,
  slidesPerView: 2,
  autoplay: {
    delay: 3000,
  },
  navigation: {
    nextEl: '.un_slider_btn-next',
    prevEl: '.un_slider_btn-prev',
  },
  breakpoints: {
    767: {
      slidesPerView: 3,
    },
  },
});

const slider = () => {
  swiper.init();
  swiper.autoplay.stop();
};

export const sliderStart = () => {
  swiper.autoplay.start();
};

export default slider;
