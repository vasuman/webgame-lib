export class Rect {

  constructor(x = 0, y = 0, w = 0, h = 0) {
    this.set(x, y, w, h);
  }

  set(x, y, w, h) {
    this.pos(x, y);
    this.dim(w, h);
    return this;
  }

  pos(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  dim(w, h) {
    this.w = w;
    this.h = h;
    return this;
  }

  contains(v) {
    return this.x <= v.x && v.x <= this.x + this.w &&
      this.y < v.y && v.y < this.y + this.h;
  }

  intersect(b) {
    return this.x <= b.x + b.w && b.x <= this.x + this.w &&
      this.y <= b.y + b.h && b.y <= this.y + this.w;
  }

  setCenter(v) {
    this.x = v.x - this.w / 2;
    this.y = v.y - this.h / 2;
    return this;
  }

  center() {
    return new V(this.x + this.w / 2, this.y + this.h / 2);
  }

  coCenter(b) {
    this.x = b.x + b.w / 2 - this.w / 2;
    this.y = b.y + b.h / 2 - this.h / 2;
    return this;
  }

  zoom(z) {
    let cX = this.x + this.w / 2;
    let cY = this.y + this.h / 2;
    this.w *= z;
    this.h *= z;
    this.x = cX - this.w / 2;
    this.y = cY - this.h / 2;
    return this;
  }

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.w = Math.round(this.w);
    this.h = Math.round(this.h);
    return this;
  }

  floor() {
    this.x = ~~(this.x);
    this.y = ~~(this.y);
    this.w = ~~(this.w);
    this.h = ~~(this.h);
    return this;
  }

  split(f, vertical = true) {
    if (vertical) {
      let p = this.w * f;
      return [
        new Rect(this.x, this.y, p, this.h),
        new Rect(this.x + p, this.y, this.w - p, this.h)
      ];
    } else {
      let p = this.h * f;
      return [
        new Rect(this.x, this.y, this.w, p),
        new Rect(this.x, this.y + p, this.w, this.h - p)
      ];
    }
  }

  area() {
    return this.w * this.h;
  }

  shrink(val) {
    this.x += val;
    this.y += val;
    this.w -= val;
    this.h -= val;
    return this;
  }

  scale(f) {
    this.x *= f;
    this.y *= f;
    this.w *= f;
    this.h *= f;
    return this;
  }

  dimInRange(min, max) {
    return min <= this.w && this.w <= max && min <= this.h && this.h <= max;
  }

  clone() {
    return new Rect(this.x, this.y, this.w, this.h);
  }
}

export class V {
  constructor(x = 0, y = 0) {
    this.set(x, y);
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  scale(f) {
    this.x *= f;
    this.y *= f;
    return this;
  }

  floor() {
    this.x = ~~(this.x);
    this.y = ~~(this.y);
    return this;
  }

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  r() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  blockDist(o) {
    return Math.abs(this.x - o.x) + Math.abs(this.y - o.y);
  }

  clone() {
    return new V(this.x, this.y);
  }
}
