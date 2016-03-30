/* @module screen */

function elem(tag, props = {}, children = []) {
  let elt = document.createElement(tag);
  for (let key of Object.keys(props)) {
    let val = props[key];
    elt.setAttribute(key, val);
  }
  for (let child of children) {
    elt.appendChild(child);
  }
  return elt;
}

/**
 * A screen is a `<canvas>` overlaid with a `<div>` for UI controls.
 */
export class Screen {

  /**
   * Initializes the DOM elements.
   * @param {number} w Width
   * @param {number} h Height
   * @param {string} cssPrefix Prefix for CSS classes
   */
  constructor(w, h, cssPrefix = 'wgl') {
    this._prefix = cssPrefix;
    this.container = elem('div', { 'class': `${this._prefix}-container` });
    this.can = elem('canvas', { 'class': `${this._prefix}-canvas` });
    this.overlay = elem('div', { 'class': `${this._prefix}-overlay` });
    this.container.appendChild(this.overlay);
    this.container.appendChild(this.can);
    this.resize(w, h);
  }

  hide() {
    this.container.style.display = 'none';
  }

  show() {
    this.container.style.display = '';
  }

  resize(w, h) {
    this.can.width = w;
    this.can.height = h;
  }

  clear() {
    let ctx = this.can.getContext('2d');
    ctx.clearRect(0, 0, this.can.width, this.can.height);
  }
}
