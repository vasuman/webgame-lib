import { Rect, Vec } from './geom.js';

/**
 * Limits a value to within a certain range.
 * @param {number} min Minimum
 * @param {number} val Value to limit
 * @param {number} max Maximum
 * @return {number} Limited value
 */
function limit(min, val, max) {
  return Math.min(max, Math.max(min, val));
}

/**
 * An orthographic viewport to a scene.
 */
export default class Camera {

  /**
   * Initializes the camera.
   * @param {number} w Width of viewport
   * @param {number} h Height of viewport
   * @param {Object} options Options
   */
  constructor(w, h, { pan = 1, zoom = 2, minZoom = 1, maxZoom = 2 } = {}) {
    /**
     * Rectangle representing the viewport.
     * @type {Rect}
     */
    this.view = new Rect();
    /**
     * Width of viewport.
     * @type {number}
     */
    this.w = w;
    /**
     * Height of viewport.
     * @type {number}
     */
    this.h = h;
    /**
     * Speed of camera pan.
     * @type {number}
     */
    this.panSpeed = pan;
    /**
     * Factor to scale by when zoomed.
     * @type {number}
     */
    this.zoomFactor = zoom;
    /**
     * Minimum zoom.
     * @type {number}
     */
    this.minZoom = minZoom;
    /**
     * Maximum zoom.
     * @type {number}
     */
    this.maxZoom = maxZoom;
    /**
     * Center of view focus.
     * @type {Vec}
     */
    this.center = new Vec(w / 2, h / 2);
    /**
     * Current zoom.
     * @type {number}
     */
    this.z = 1;
    /**
     * Maximum limit for `center.x`
     * @type {number}
     */
    this.limX = Infinity;
    /**
     * Maximum limit for `center.y`
     * @type {number}
     */
    this.limY = Infinity;
    this._test = new Rect();
  }

  /**
   * Sets maximum limits for center.
   * @param {number} x X coordinate limit
   * @param {number} y Y coordinate limit
   */
  setLimits(x, y) {
    this.limX = x;
    this.limY = y;
  }

  /**
   * Pans the view.
   * @param {number} px Distance along X direction
   * @param {number} py Distance along Y direction
   */
  pan(px, py) {
    this.center.x -= this.panSpeed * px / this.z;
    this.center.y -= this.panSpeed * py / this.z;
    this.center.x = limit(0, this.center.x, this.limX);
    this.center.y = limit(0, this.center.y, this.limY);
  }

  /**
   * Zooms the view.
   * @param {boolean} out Whether zooming out
   */
  zoom(out = false) {
    if (out) {
      this.z /= this.zoomFactor;
    } else {
      this.z *= this.zoomFactor;
    }
    this.z = limit(this.minZoom, this.z, this.maxZoom);
  }

  /**
   * Translate a point from screen space to world space.
   * @param {Vec} v Point on screen
   * @return {Vec} Point in world space coordinates
   */
  screenToWorld(v) {
    return v.scale(1 / this.z).add(this.view);
  }

  /**
   * Apply transformations to the supplied context. Usually called at the
   * beginning of every render cycle.
   * @param {CanvasRenderingContext2D} ctx Render context
   */
  begin(ctx) {
    this.view.set(this.center.x - this.w / 2, this.center.y - this.h / 2,
        this.w, this.h);
    this.view.zoom(1 / this.z);
    this._ctx = ctx;
    this.black();
    this._ctx.save();
    this._ctx.scale(this.z, this.z);
    this._ctx.translate(-this.view.x, -this.view.y);
  }

  /**
   * Reset transformations applied to context. Called after the
   * `begin()` method.
   */
  end() {
    this._ctx.restore();
  }

  /**
   * Black out the whole screen.
   */
  black() {
    this._ctx.fillStyle = 'black';
    this._ctx.fillRect(0, 0, this.w, this.h);
  }

  /**
   * Draw object on screen. Culls if the object is out of view.
   * @param {Drawer} drawer Object to draw
   * @param {Vec} p Center position to draw at
   */
  draw(drawer, p) {
    drawer.bounds(this._test);
    this._test.fix(p);
    if (!this._test.intersect(this.view)) {
      return;
    }
    drawer.draw(this._ctx, this._test.x, this._test.y);
  }

  /**
   * Draw background image with transformations applied.
   * @param {Image} img Background image
   */
  background(img) {
    let left = Math.max(0, this.view.x);
    let top = Math.max(0, this.view.y);
    let w = this.view.w - Math.min(0, this.view.x);
    let h = this.view.h - Math.min(0, this.view.y);
    this._ctx.drawImage(img, left, top, w, h, left, top, w, h);
  }

}

/**
 * An object that the camera is capable of culling and drawing to the screen.
 * @interface
 */
export class Drawer {

  /* eslint-disable */
  /**
   * Set the rectangular bounds of the section to draw.
   * @param {Rect} rect Object bounds
   */
  bounds(rect) {}

  /**
   * Draw.
   * @param {CanvasRenderingContext2D} ctx Render context
   * @param {number} x Transformed x coordinate
   * @param {number} y Transformed y coordinate
   */
  draw(ctx, x, y) {}
  /* eslint-enable */

}
