// example manifest
let manifest = {
  images: {
    'imgs/all.png': {
      'player': {
        x: 0,
        y: 0,
        w: 16,
        h: 16,
        scale: 1,
      }
    }
  }
}

export default class Assets {
  constructor({ prefix = '/', smoothImage = true } = {}) {
    this.prefix = prefix;
    this.smoothImage = smoothImage;
    this.images = new Map();
  }

  load(manifest, callback) {
    let srcs = Object.keys(manifest.images);
    let cnt = src.length - 1;
    for (let src of srcs) {
      let img = new Image();

      img.addEventListener('load', () => {
        let defs = manifest.images[src];
        for (let name of Object.keys(defs)) {
          let def = defs[name];
          let can = document.createElement('canvas');
          let scale = def.scale || 1;
          let w = can.width = scale * def.w;
          let h = can.height = scale * def.h;
          let ctx = can.getContext('2d');
          ctx.imageSmoothingEnabled = this.smoothImage;
          ctx.drawImage(img, def.x, def.y, def.w, def.h, 0, 0, w, h);
          this.images.set(name, can);
        }
        cnt -= 1;
        if (cnt == 0) {
          callback();
        }
      });

      img.src = this.prefix + src;
    }
  }

}

