import gsap from 'gsap';

export default class Fade {
  public element?: string | object | HTMLElement | gsap.TweenTarget | null;
  public duration?: gsap.TweenValue | undefined;
  public ease?: string | gsap.EaseFunction | undefined;
  public display?: gsap.TweenValue | undefined;
  public show?: boolean | null;

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

  fadeOut() {
    gsap.set(this.element!, { opacity: 1, display: this.display });
    gsap.to(this.element!, {
      opacity: 0,
      ease: this.ease,
      duration: this.duration,
      onComplete: (): void => {
        gsap.set(this.element!, { display: 'none' });
      },
    });
  }

  fadeIn() {
    gsap.set(this.element!, {
      opacity: 0,
      display: this.display,
      pointerEvents: 'all',
    });
    gsap.to(this.element!, {
      opacity: 1,
      ease: this.ease,
      duration: this.duration,
    });
  }

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
