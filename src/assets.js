/*
let manifest = {
  images: {
    'imgs/all.png': {
      'player': {
        x: 0,
        y: 0,
        w: 16,
        h: 16,
        scale: 1
      }
    }
  }
};
*/

function loadImage(src) {
  let img = new Image();
  img.src = src;
  return new Promise((resolve) => {
    img.addEventListener('load', () => {
      resolve(img);
    });
  });
}

export default class Assets {

  constructor({ prefix = '/', smoothImage = true } = {}) {
    this.prefix = prefix;
    this.smoothImage = smoothImage;
    this.images = new Map();
  }

  load(manifest) {
    let srcs = Object.keys(manifest.images);
    let ps = [];
    for (let src of srcs) {
      let p = loadImage(this.prefix + src).then((img) => {
        let defs = manifest.images[src];
        let names = Object.keys(defs);
        for (let name of names) {
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
      });
      ps.push(p);
    }
    return Promise.all(ps);
  }

}

