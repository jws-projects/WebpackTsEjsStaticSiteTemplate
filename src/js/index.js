import imagesLoaded from 'imagesloaded';
import ytmodal from './components/Ytmodal';
import './util/lazyLoad';
import SlideToggle from './util/slideToggle';

const elm = document.querySelector('body');

const slideToggle = new SlideToggle();

const loadScript = async () => {};

const afterLoadScript = async () => {
  ytmodal.init();
  slideToggle.toggle();
};

const mainScript = async () => {
  loadScript().then(afterLoadScript());
};

const callback = (instance) => {
  mainScript();
};

imagesLoaded(elm, { background: true }, callback);

// window.onbeforeunload = function () {
//   window.scrollTo(0, 0);
// };
