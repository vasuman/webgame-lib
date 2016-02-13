export function seed(val) {
  // TODO: implement
}

export function f(s = 0, e = 1) {
  return s + Math.random() * (e - s);
}

export function i(s, e) {
  return ~~(f(s, e));
}

export function bool(bias = 1, exp = 1) {
  return Math.random() / Math.pow(bias, exp) < 0.5;
}
