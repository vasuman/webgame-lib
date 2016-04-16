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

const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  'z-index': 1
};

const containerStyle = {
    position: 'relative',
    display: 'flex'
};

/**
 * A screen is a `<canvas>` overlaid with a `<div>` for UI controls.
 */
export default class Screen {

  /**
   * Initializes the DOM elements.
   * @param {number} w Width
   * @param {number} h Height
   * @param {string} cssPrefix Prefix for CSS classes
   */
  constructor(w, h, cssPrefix = 'wgl') {
    this._prefix = cssPrefix;
    this.can = elem('canvas', { 'class': `${this._prefix}-canvas` });
    this.overlay = elem('div', { 'class': `${this._prefix}-overlay` });
    this.container = elem('div', { 'class': `${this._prefix}-container` });
    Object.assign(this.container.style, containerStyle);
    Object.assign(this.overlay.style, overlayStyle);
    this.container.appendChild(this.overlay);
    this.container.appendChild(this.can);
    this.resize(w, h);
  }

  addTo(elt) {
    elt.appendChild(this.container);
  }

  hide() {
    this.container.style.display = 'none';

  }

  show() {
    this.container.style.display = 'flex';
  }

  resize(w, h) {
    this.can.width = w;
    this.can.height = h;
  }

  clear() {
    this.getContext().clearRect(0, 0, this.can.width, this.can.height);
  }

  getContext() {
    return this.can.getContext('2d');
  }

}
