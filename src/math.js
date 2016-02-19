/**
 * Rectangle in 2D space.
 */
export class Rect {

  /**
   * Initializes a rectangle.
   * @param {number} x left
   * @param {number} y top
   * @param {number} w width
   * @param {number} h height
   */
  constructor(x = 0, y = 0, w = 0, h = 0) {
    this.set(x, y, w, h);
  }

  /**
   * Sets all properties.
   * @param {number} x left
   * @param {number} y top
   * @param {number} w width
   * @param {number} h height
   * @return {Rect} self
   */
  set(x, y, w, h) {
    this.pos(x, y);
    this.dim(w, h);
    return this;
  }

  /**
   * Sets the position of the rectangle.
   * @param {number} x left
   * @param {number} y top
   * @return {Rect} self
   */
  pos(x, y) {
    /**
     * Left of rectangle.
     * @type {number}
     */
    this.x = x;
    /**
     * Top of rectangle.
     * @type {number}
     */
    this.y = y;
    return this;
  }

  /**
   * Sets the dimensions of the rectangle.
   * @param {number} w width
   * @param {number} h height
   * @return {Rect} self
   */
  dim(w, h) {
    /**
     * Width of rectangle.
     * @type {number}
     */
    this.w = w;
    /**
     * Height of rectangle.
     * @type {number}
     */
    this.h = h;
    return this;
  }

  /**
   * Checks whether a point is contained in the rectangle.
   * @param {Vec} v point
   * @return {boolean} whether contained
   */
  contains(v) {
    return this.x <= v.x && v.x <= this.x + this.w &&
      this.y < v.y && v.y < this.y + this.h;
  }

  /**
   * Checks whether two rectangles intersect.
   * @param {Rect} b rectangle to test against.
   * @return {boolean} whether intersects
   */
  intersect(b) {
    return this.x <= b.x + b.w && b.x <= this.x + this.w &&
      this.y <= b.y + b.h && b.y <= this.y + this.w;
  }

  /**
   * Centers the rectangle on given point.
   * @param {Vec} v center point
   * @return {Rect} self
   */
  setCenter(v) {
    this.x = v.x - this.w / 2;
    this.y = v.y - this.h / 2;
    return this;
  }

  /**
   * Calculates the center of the rectangle.
   * @return {Vec} center
   */
  center() {
    return new Vec(this.x + this.w / 2, this.y + this.h / 2);
  }

  /**
   * Scales the dimensions about the center.
   * @param {number} z factor to scale by
   * @return {Rect} self
   */
  zoom(z) {
    let cX = this.x + this.w / 2;
    let cY = this.y + this.h / 2;
    this.w *= z;
    this.h *= z;
    this.x = cX - this.w / 2;
    this.y = cY - this.h / 2;
    return this;
  }

  /**
   * Rounds all the properties of the rectangle.
   * @return {Rect} self
   */
  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.w = Math.round(this.w);
    this.h = Math.round(this.h);
    return this;
  }

  /**
   * Floors all the properties of the rectangle.
   * @return {Rect} self
   */
  floor() {
    this.x = ~~(this.x);
    this.y = ~~(this.y);
    this.w = ~~(this.w);
    this.h = ~~(this.h);
    return this;
  }

  /**
   * Splits the rectangle into two along one axis.
   * @param {number} f ratio of first part to original
   * @param {boolean} vertical axis along which to split
   * @return {Rect[]} parts
   */
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

  overlap(b, vertical = true) {
    let p = vertical ? 'y' : 'x';
    let d = (p === 'y') ? 'h' : 'w';
    let [min, max] = [this, b].sort((a, b) => a[p] - b[p]);
    if (min[p] + min[d] > max[p]) {
      return [max[p], Math.min(min[p] + min[d], max[p] + max[d])];
    }
    return null;
  }

}

export class Vec {
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
    return new Vec(this.x, this.y);
  }
}
