export function elem(tag, props = {}, children = []) {
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
 * A screen is a <code>&lt;canvas&gt;</code> overlaid with a
 * <code>&lt;div&gt;</code> for UI controls.
 */
export class Screen {

  constructor(w, h, cssPrefix = 'wgl') {
    this.prefix = cssPrefix;
    this.container = elem('div', { 'class': `${this.prefix}-container` });
    this.can = elem('canvas', { 'class': `${this.prefix}-canvas` });
    this.can.width = w;
    this.can.height = h;
    this.overlay = elem('div', { 'class': `${this.prefix}-overlay` });
    this.container.appendChild(this.overlay);
    this.container.appendChild(this.can);
  }

  actions(as) {
    let container = elem('div', { 'class': 'actions' });
    root.appendChild(container);
    return as.map((name) => {
      let btn = elem('button', { 'class': 'action' }, [name]);
      let promise = new Promise(function (resolve, reject) {
        btn.addEventListener('click', (e) => {
          resolve(e, container);
        });
      });
      container.appendChild(btn);
      return promise;
    });
  }

}
