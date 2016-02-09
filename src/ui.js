import { Rect, V } from './math.js';

class Deferred {
  constructor() {
    this.cb = null;
  }

  on(cb) {
    this.cb = cb;
  }

  fulfill(container) {
    if (this.cb) {
      this.cb(container);
    }
  }
}

function c(name, classes = [], id = '') {
  let elt = document.createElement(name);
  if (classes.length > 0) {
    elt.className = classes.join(' ');
  }
  if (id) {
    elt.id = id;
  }
  return elt;
}

export default class Interface {
  constructor(elt) {
    this.root = elt;
  }

  actions(as, aClass) {
    let container = c('div', ['actions', aClass]);
    root.appendChild(container);
    return as.map((name) => {
      let btn = c('button', ['action']);
      let def = new Deferred();
      btn.innerText = name;
      btn.addEventListener('click', (e) => {
        def.fulfill(container);
      });
      container.appendChild(btn);
      return def;
    });
  }
}
