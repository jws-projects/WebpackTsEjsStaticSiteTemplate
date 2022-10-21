import gsap from 'gsap';

export default class Fade {
  /**
   * Fadeに関するClass
   * @param {{
   *  element: HTMLElement,
   *  duration: number,
   *  ease: String,
   *  display: String
   * }}
   */
  constructor({
    element = document.querySelector('.js-fade'),
    duration = 0.5,
    ease = 'expo.out',
    display = 'block',
  }) {
    this.element = element;
    this.duration = duration;
    this.ease = ease;
    this.display = display;
    this.show = false;
  }

  /**
   * fadeOutを行うための関数。
   */
  fadeOut() {
    gsap.set(this.element, { opacity: 1, display: this.display });
    gsap.to(this.element, {
      opacity: 0,
      ease: this.ease,
      duration: this.duration,
      // onStart: () => {
      //   document.querySelector(this.element).style.pointerEvents = 'none';
      // },
      onComplete: () => {
        document.querySelector(this.element).style.display = 'none';
      },
    });
  }

  /**
   * fadeInを行うための関数。
   */
  fadeIn() {
    gsap.set(this.element, {
      opacity: 0,
      display: this.display,
      pointerEvents: 'all',
    });
    gsap.to(this.element, {
      opacity: 1,
      ease: this.ease,
      duration: this.duration,
    });
  }

  /**
   * fadeToggle
   */
  fadeToggle() {
    if (!this.show) {
      this.fadeIn();
      this.show = true;
    } else {
      this.fadeOut();
      this.show = false;
    }
  }
}
