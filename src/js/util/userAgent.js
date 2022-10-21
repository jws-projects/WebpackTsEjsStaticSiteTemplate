const UAParser = require('ua-parser-js');

const ua = (() => {
  class UA {
    constructor() {
      this.uaParser = UAParser();
      this.body = document.querySelector('body');
    }

    init() {
      this.setUA();
    }

    getBrowser() {
      return this.uaParser.browser.name.replace(/\s+/g, '').toLowerCase();
    }

    getDevice() {
      const type = this.uaParser.device.type;
      let typeResult = '';
      if (type === 'mobile') {
        typeResult = 'sp';
      } else if (type === 'tablet') {
        typeResult = 'tb';
      } else {
        typeResult = 'pc';
      }
      return typeResult;
    }

    getModel() {
      return this.uaParser.device.model
        ? this.uaParser.device.model.replace(/\s+/g, '').toLowerCase()
        : '';
    }

    getOS() {
      return this.uaParser.os.name.replace(/\s+/g, '').toLowerCase();
    }

    setUA() {
      this.body.classList.add(`ua-${this.getBrowser()}`);
      this.body.classList.add(`ua-${this.getDevice()}`);
      if (this.getModel()) {
        this.body.classList.add(`ua-${this.getModel()}`);
      }
      this.body.classList.add(`ua-${this.getOS()}`);
    }
  }
  return new UA();
})();

export default ua;
