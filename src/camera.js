import { Rect, Vec } from './math.js';

let test = new Rect();

export default class Camera {

  init(w, h) {
    this.view = new Rect();
    this.w = w;
    this.h = h;
    this.center = new Vec(w / 2, h / 2);
    this.z = 1;
  }

  setBounds(w, h) {
    this.limX = w;
    this.limY = h;
  }

  pan(px, py) {
    this.center.x -= PAN_SPEED * px / this.z;
    this.center.y -= PAN_SPEED * py / this.z;
    this.center.x = limit(0, this.center.x, this.limX);
    this.center.y = limit(0, this.center.y, this.limY);
  }

  zoom(v) {
    if (v < 0) {
      this.z /= ZOOM_FACTOR;
    } else {
      this.z *= ZOOM_FACTOR;
    }
    this.z = limit(MIN_ZOOM, this.z, MAX_ZOOM);
  }

  transform(v) {
    return v.scale(1 / this.z).add(this.view);
  }

  begin(ctx) {
    this.view.set(this.center.x - this.w / 2, this.center.y - this.h / 2,
        this.w, this.h);
    this.view.zoom(1 / this.z);
    this.ctx = ctx;
    this.black();
    this.ctx.save();
    this.ctx.scale(this.z, this.z);
    this.ctx.translate(-this.view.x, -this.view.y);
  }

  end() {
    this.ctx.restore();
  }

  black() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.w, this.h);
  }

  line(p, vertical = true, color = 'black') {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    if (vertical) {
      let x = this.view.x + p;
      this.ctx.moveTo(x, this.view.y);
      this.ctx.lineTo(x, this.view.y + this.view.h);
    } else {
      let y = this.view.y + p;
      this.ctx.moveTo(this.view.x, y);
      this.ctx.lineTo(this.view.x + this.view.w, y);
    }
    this.ctx.closePath();
    this.ctx.stroke();
  }

  draw(drawer, p) {
    drawer.bounds(test);
    test.fix(p);
    if (!test.intersect(this.view)) {
      return;
    }
    drawer.draw(this.ctx, test.x, test.y);
  }

  background(img) {
    let left = Math.max(0, this.view.x);
    let top = Math.max(0, this.view.y);
    let w = this.view.w - Math.min(0, this.view.x);
    let h = this.view.h - Math.min(0, this.view.y);
    this.ctx.drawImage(img, left, top, w, h, left, top, w, h);
  }

  static get Drawer() {
    return class Drawer {
      bounds(test) {}
      draw(ctx, x, y) {}
    }
  }
}
