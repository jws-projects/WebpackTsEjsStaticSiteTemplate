import Fade from '../util/Fade';

class Ytmodal {
  constructor() {
    this.movBtns = document.querySelectorAll('.js-ytmodalbtn');
    this.modal = document.querySelector('.bl_modal');
    this.iframeYt = document.querySelector('.bl_modal_yt iframe');
    this.modalMask = document.querySelector('.bl_modal_mask');

    this.fade = new Fade({ element: this.modal });
  }

  show() {
    this.movBtns.forEach((movBtn) => {
      movBtn.addEventListener('click', () => {
        const yt = movBtn.getAttribute('data-yt');
        this.iframeYt.setAttribute(
          'src',
          `https://www.youtube.com/embed/${yt}`
        );
        this.fade.fadeIn();
      });
    });
  }

  hide() {
    this.modalMask.addEventListener('click', () => {
      this.iframeYt.setAttribute('src', ``);
      this.fade.fadeOut();
    });
  }

  init() {
    this.show();
    this.hide();
  }
}

const ytmodal = new Ytmodal();
export default ytmodal;
