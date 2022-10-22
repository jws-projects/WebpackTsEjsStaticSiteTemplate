// import gsap from 'gsap';

// /**
//  * SlideToggleに関するClass
//  */
// export default class SlideToggle {
//   /**
//    * @param {String} parent スライドを包括するclass
//    * @param {String} trigger トリガーとなるclass
//    * @param {String} target ターゲットとなるclass
//    */
//   constructor(trigger = '.js-slide-trigger', target = '.js-slide-target') {
//     this.trigger = document.querySelectorAll(trigger);
//     this.target = document.querySelectorAll(target);
//     gsap.set(this.target, {
//       height: 0,
//       overflow: 'hidden',
//     });
//   }

//   open(tg) {
//     tg.classList.add('is-open');
//     gsap.to(tg, {
//       height: 'auto',
//       duration: 0.5,
//       ease: 'power3.out',
//     });
//   }

//   close(tg) {
//     tg.classList.remove('is-open');
//     gsap.to(tg, {
//       height: 0,
//       duration: 0.5,
//       ease: 'power3.out',
//     });
//   }

//   slideDataToggle() {
//     for (let i = 0; i < this.trigger.length; i++) {
//       this.trigger[i].addEventListener('click', (e) => {
//         const dataSlide = this.trigger[i].getAttribute('data-slide');
//         let tg;
//         for (let j = 0; j < this.target.length; j++) {
//           if (this.target[j].getAttribute('data-slide') === dataSlide) {
//             tg = this.target[j];
//           }
//         }
//         const result = tg.classList.contains('is-open');
//         if (result) {
//           this.close(tg);
//         } else {
//           this.open(tg);
//         }
//       });
//     }
//   }

//   nextToggle() {
//     for (let i = 0; i < this.trigger.length; i++) {
//       this.trigger[i].addEventListener('click', () => {
//         const tg = this.trigger[i].nextElementSibling;
//         const result = tg.classList.contains('is-open');
//         if (result) {
//           this.close(tg);
//         } else {
//           this.open(tg);
//         }
//       });
//     }
//   }
// }
