// import imagesLoaded from 'imagesloaded';
import ytmodal from './components/ytModal';
import './util/lazyLoad';

declare var BREAK_POINT: number;

// import SlideToggle from './util/slideToggle';

// const elm = document.querySelector('body');

// const slideToggle = new SlideToggle();
ytmodal.init();

const msg: string = 'Hello TypeScript';
console.log(msg);

console.log('BREAK_POINT :>> ', BREAK_POINT);

// BREAK_POINT
// const loadScript = async () => {};

// const afterLoadScript = async () => {
//   // slideToggle.toggle();
// };

// const mainScript = async () => {
//   loadScript().then(afterLoadScript());
// };

// const callback = (instance) => {
//   mainScript();
// };

// imagesLoaded(elm, { background: true }, callback);

// // window.onbeforeunload = function () {
// //   window.scrollTo(0, 0);
// // };
