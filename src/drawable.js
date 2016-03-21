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
 */
export class Square extends Drawable {

  /**
   * Initializes.
   * @param {number} size Length of side
   * @param {string} style Color
   */
  constructor(size, style = 'black') {
    this.size = size;
    this.style = style;
    this.pos = new Vec();
  }

  bounds(rect) {
    rect.dim(this.size, this.size);
  }

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
    this.radius = radius;
    this.style = style;
  }

  bounds(rect) {
    let diam = 2 * this.radius;
    rect.dim(diam, diam);
  }

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
    this.img = img;
    this.pos = new Vec();
  }

  bounds(rect) {
    rect.dim(img.width, img.height);
  }

  draw(ctx, x, y) {
    ctx.drawImage(img, x, y);
  }
}

export class Animation extends Drawable {

  /**
   * Sets up the animation.
   */
  constructor(images, frames) {
    this.images = images;
    this.frames = frames;
    this._frameIdx = 0;
    this._count = 0;
  }

  bounds(rect) {
    let img = this.images[this._frameIdx];
    rect.dim(img.width, img.height);
  }

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
