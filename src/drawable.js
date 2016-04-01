/* @module drawable */

import {Vec} from './geom.js';

/* eslint-disable no-unused-vars */

/**
 * An object that the camera is capable of culling and drawing to the screen.
 * @interface
 */
export class Drawable {

  /**
   * Set the rectangular bounds of the section to draw.
   * @param {Rect} rect Object bounds
   */
  bounds(rect) {
  }

  /**
   * Draws at given position.
   * @param {CanvasRenderingContext2D} ctx Render context
   * @param {number} x Transformed x coordinate
   * @param {number} y Transformed y coordinate
   */
  draw(ctx, x, y) {}

}

/* eslint-enable */

/**
 * Simple square.
 * @implements {Drawable}
 */
export class Square extends Drawable {

  /**
   * Initializes.
   * @param {number} size Length of side
   * @param {string} style Color
   */
  constructor(size, style = 'black') {
    super();
    /**
     * Length of side.
     * @type {number}
     */
    this.size = size;
    /**
     * Fill style.
     * @type {string}
     */
    this.style = style;
  }

  /**
   * @inheritdoc
   */
  bounds(rect) {
    rect.dim(this.size, this.size);
  }

  /**
   * @inheritdoc
   */
  draw(ctx, x, y) {
    ctx.fillStyle = this.style;
    ctx.fillRect(x, y, size, size);
  }
}

/**
 * Simple circle.
 */
export class Circle extends Drawable {

  /**
   * Initializes
   * @param {number} radius Radius of circle
   * @param {string} style Color
   */
  constructor(radius, style = 'black') {
    super();
    /**
     * Raduis.
     * @type {number}
     */
    this.radius = radius;
    /**
     * Fill style.
     * @type {string}
     */
    this.style = style;
  }

  /**
   * @inheritdoc
   */
  bounds(rect) {
    let diam = 2 * this.radius;
    rect.dim(diam, diam);
  }

  /**
   * @inheritdoc
   */
  draw(ctx, x, y) {
    ctx.fillStyle = style;
    ctx.beginPath();
    ctx.arc(x + this.radius, y + this.radius, this.radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  }
}

/**
 * Image.
 */
export class Sprite extends Drawable {

  /**
   * Initializes.
   * @param {Image} img Image to draw
   */
  constructor(img) {
    super();
    /**
     * Image.
     * @type {Image}
     */
    this.img = img;
  }

  /**
   * @inheritdoc
   */
  bounds(rect) {
    rect.dim(img.width, img.height);
  }

  /**
   * @inheritdoc
   */
  draw(ctx, x, y) {
    ctx.drawImage(img, x, y);
  }
}

export class Animation extends Drawable {

  /**
   * Sets up the animation.
   * @param {Image[]} images Sequence of images
   * @param {number[]} frames Number of frames for which image is active
   */
  constructor(images, frames) {
    super();
    this.images = images;
    this.frames = frames;
    this._frameIdx = 0;
    this._count = 0;
  }

  /**
   * @inheritdoc
   */
  bounds(rect) {
    let img = this.images[this._frameIdx];
    rect.dim(img.width, img.height);
  }

  /**
   * @inheritdoc
   */
  draw(ctx, x, y) {
    let img = this.images[this._frameIdx];
    ctx.drawImage(img, x, y);
    this._count += 1;
    if (this._count >= this.frames[this._frameIdx]) {
      this._frameIdx = (this._frameIdx + 1) % this.frames.length;
      this._count = 0;
    }
  }
}

export class PreDrawn extends Drawable {

  constructor() {

  }
}
