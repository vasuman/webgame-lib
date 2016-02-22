
function dim(axis) {
  switch (axis) {
    case 'x': return 'w';
    case 'y': return 'h';
    default: return null;
  }
}

function isVertical(axis) {
  return axis === 'y';
}

/**
 * Rectangle in 2D space.
 */
export class Rect {

  /**
   * Initializes a rectangle.
   * @param {number} x Left
   * @param {number} y Top
   * @param {number} w Width
   * @param {number} h Height
   */
  constructor(x = 0, y = 0, w = 0, h = 0) {
    this.set(x, y, w, h);
  }

  /**
   * Sets all properties.
   * @param {number} x Left
   * @param {number} y Top
   * @param {number} w Width
   * @param {number} h Height
   * @return {Rect} self
   */
  set(x, y, w, h) {
    this.pos(x, y);
    this.dim(w, h);
    return this;
  }

  /**
   * Sets the position of the rectangle.
   * @param {number} x Left
   * @param {number} y Top
   * @return {Rect} Self
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
   * @param {number} w Width
   * @param {number} h Height
   * @return {Rect} Self
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
   * @param {Vec} v Point
   * @return {boolean} Whether contained
   */
  contains(v) {
    return this.x <= v.x && v.x <= this.x + this.w &&
      this.y < v.y && v.y < this.y + this.h;
  }

  /**
   * Checks whether two rectangles intersect.
   * @param {Rect} b Rectangle to test against.
   * @return {boolean} Whether intersects
   */
  intersect(b) {
    return this.x <= b.x + b.w && b.x <= this.x + this.w &&
      this.y <= b.y + b.h && b.y <= this.y + this.w;
  }

  /**
   * Centers the rectangle on given point.
   * @param {Vec} v Center point
   * @return {Rect} Self
   */
  setCenter(v) {
    this.x = v.x - this.w / 2;
    this.y = v.y - this.h / 2;
    return this;
  }

  /**
   * Calculates the center of the rectangle.
   * @return {Vec} Center
   */
  center() {
    return new Vec(this.x + this.w / 2, this.y + this.h / 2);
  }

  /**
   * Scales the dimensions about the center.
   * @param {number} z Factor to scale by
   * @return {Rect} Self
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
   * @return {Rect} Self
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
   * @return {Rect} Self
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
   * @param {number} f Ratio of first part to original
   * @param {string} axis Axis along which to split
   * @return {Rect[]} Parts
   */
  split(f, axis = 'y') {
    if (isVertical(axis)) {
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
   * @return {number} Area
   */
  area() {
    return this.w * this.h;
  }

  /**
   * Shrinks the rectangle about the center.
   * @param {number} val Amount to shrink
   * @return {Rect} Self
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
   * @param {number} f Factor to scale by
   * @return {Rect} Self
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
   * @param {number} min Minimum
   * @param {number} max Maximum
   * @return {boolean} Whether dimensions are in range
   */
  dimInRange(min, max) {
    return min <= this.w && this.w <= max && min <= this.h && this.h <= max;
  }

  /**
   * Returns an identical instance.
   * @return {Rect} Copy of self
   */
  clone() {
    return new Rect(this.x, this.y, this.w, this.h);
  }

  /**
   * Calculates the overlap with other rectangle along one axis.
   * @param {Rect} b Other rectangle
   * @param {string} axis Axis
   * @return {?int[]} Two element tuple of `[start, end]`
   */
  overlap(b, axis) {
    let d = dim(axis);
    let [min, max] = [this, b].sort((a, b) => a[axis] - b[axis]);
    if (min[axis] + min[d] > max[axis]) {
      return [max[axis], Math.min(min[axis] + min[d], max[axis] + max[d])];
    }
    return null;
  }

  /**
   * Finds the axis that seperate the rectangles.
   * @param {Rect} b Other rectangle
   * @return {string[]} List of axis that seperate the two rectangles
   */
  seperationAxis(b) {
    return ['x', 'y'].filter((axis) => {
      return this.overlap(b, isVertical(axis)) === null;
    });
  }
}

/**
 * Denotes a point in 2D space.
 */
export class Vec {

  /**
   * Initializes a point.
   * @param {number} x X coordinate
   * @param {number} y Y coordinate
   */
  constructor(x = 0, y = 0) {
    this.set(x, y);
  }

  /**
   * Sets the properties.
   * @param {number} x X coordinate
   * @param {number} y Y coordinate
   * @return {Vec} Self
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
   * @param {Vec} v Other
   * @return {Vec} Self
   */
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  /**
   * Sums with another vector.
   * @param {Vec} v Other
   * @return {Vec} Self
   */
  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  /**
   * Scales the vector.
   * @param {number} f Factor to scale by
   * @return {Vec} Self
   */
  scale(f) {
    this.x *= f;
    this.y *= f;
    return this;
  }

  /**
   * Floors all properties.
   * @return {Vec} Self
   */
  floor() {
    this.x = ~~(this.x);
    this.y = ~~(this.y);
    return this;
  }

  /**
   * Rounds all properties.
   * @return {Vec} Self
   */
  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  /**
   * Magnitude of the vector.
   * @return {number} Resultant
   */
  get r() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Calculates the manhattan distance with another vector.
   * @param {Vec} v Other
   * @return {number} Block distance
   */
  blockDist(v) {
    return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
  }

  /**
   * Returns an identical instance.
   * @return {Vec} Copy of self
   */
  clone() {
    return new Vec(this.x, this.y);
  }
}
