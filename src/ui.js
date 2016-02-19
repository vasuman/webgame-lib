import { Rect, Vec } from './math.js';

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
