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
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.w = Math.floor(this.w);
    this.h = Math.floor(this.h);
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

  /**
   * Returns the area under the rectangle.
   * @return {number} area
   */
  area() {
    return this.w * this.h;
  }

  /**
   * Shrinks the rectangle about the center.
   * @param {number} val amount to shrink
   * @return {Rect} self
   */
  shrink(val) {
    this.x += val;
    this.y += val;
    this.w -= val;
    this.h -= val;
    return this;
  }

  /**
   * Scales the entire rectangle.
   * @param {number} f factor to scale by
   * @return {Rect} self
   */
  scale(f) {
    this.x *= f;
    this.y *= f;
    this.w *= f;
    this.h *= f;
    return this;
  }

  /**
   * Checks that the dimensions of the rectangle are in the supplied range.
   * @param {number} min minimum
   * @param {number} max maximum
   * @return {boolean} whether dimensions are in range
   */
  dimInRange(min, max) {
    return min <= this.w && this.w <= max && min <= this.h && this.h <= max;
  }

  /**
   * Returns an identical instance.
   * @return {Rect} copy of self
   */
  clone() {
    return new Rect(this.x, this.y, this.w, this.h);
  }

  /**
   * Calculates the overlap with other rectangle along one axis.
   * @param {Rect} b other rectangle
   * @param {boolean} vertical axis
   * @return {?int[]} two element tuple of [start, end]
   */
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

/**
 * Denotes a point in 2D space.
 */
export class Vec {

  /**
   * Initializes a point.
   * @param {number} x x-coordinate
   * @param {number} y y-coordinate
   */
  constructor(x = 0, y = 0) {
    this.set(x, y);
  }

  /**
   * Sets the properties.
   * @param {number} x x-coordinate
   * @param {number} y y-coordinate
   */
  set(x, y) {
    /**
     * X coordinate.
     * @type {number}
     */
    this.x = x;
    /**
     * Y coordinate.
     * @type {number}
     */
    this.y = y;
    return this;
  }

  /**
   * Difference with another vector.
   * @param {Vec} v other
   * @return {Vec} self
   */
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  /**
   * Sums with another vector.
   * @param {Vec} v other
   * @return {Vec} self
   */
  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  /**
   * Scales the vector.
   * @param {number} f factor to scale by
   * @return {Vec} self
   */
  scale(f) {
    this.x *= f;
    this.y *= f;
    return this;
  }

  /**
   * Floors all properties.
   * @return {Vec} self
   */
  floor() {
    this.x = ~~(this.x);
    this.y = ~~(this.y);
    return this;
  }

  /**
   * Rounds all properties.
   * @return {Vec} self
   */
  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  /**
   * Magnitude of the vector.
   * @return {number} resultant
   */
  get r() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Calculates the manhattan distance with another vector.
   * @param {Vec} v other vector
   * @return {number} block distance
   */
  blockDist(v) {
    return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
  }

  /**
   * Returns an identical instance.
   * @return {Vec} copy of self
   */
  clone() {
    return new Vec(this.x, this.y);
  }
}
