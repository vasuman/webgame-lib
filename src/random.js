const M = 8278626;
const P = 1;

let s = 0;

function n() {
  s = Math.sin(P + s) * M;
  s -= ~~(s);
  return s;
}

export function seed(val) {
  s = val;
}

export function color() {
  return `rgba(${i(0, 255)}, ${i(0, 255)}, ${i(0, 255)}, 255)`;
}

export function letters(n = 1) {
  return Array.from(new Array(n), () => String.fromCharCode(i(97, 122))).join('');
}

export function f(s = 0, e = 1) {
  return s + n() * (e - s);
}

export function i(s, e) {
  return ~~(f(s, e));
}

export function bool(bias = 1, exp = 1) {
  return n() / Math.pow(bias, exp) < 0.5;
}
