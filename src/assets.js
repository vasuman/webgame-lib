/* @module assets */

function loadImage(src) {
  let img = new Image();
  img.src = src;
  return new Promise((resolve, reject) => {
    img.addEventListener('load', () => {
      resolve(img);
    });
    img.addEventListener('error', () => {
      reject(new Error(`Failed to load image ${src}`));
    });
  });
}

function loadData(src) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', src, true);
  xhr.send();
  return new Promise((resolve, reject) => {
    xhr.onlaod = () => {
      try {
        resolve(JSON.parse(xhr.responseText));
      } catch (e) {
        reject(new Error(`Failed to parse ${src} because ${e}`));
      }
    }
    xhr.onerror = () => {
      reject(new Error(`Failed to load data from ${src}`));
    }
  });
}

/**
 * Loads required assets.
 */
export default class Assets {

  /**
   * Initializes but **does not** load.
   * @param {Object} options
   * @param {string} options.prefix Path prefix for all assets
   * @param {boolean} options.smoothImage Whether scaled images use pixel
   * interpolation
   */
  constructor({ prefix = '/', smoothImage = true } = {}) {
    this.prefix = prefix;
    this._smoothImage = smoothImage;
    /**
     * Maps image names to images.
     * @type {Map<string, CanvasImageSource>}
     */
    this.images = new Map();
    /**
     * Maps JSON paths to data.
     * @type {Map<string, Object>}
     */
    this.data = new Map();
  }

  /**
   * Loads all the assets specified in the manifest.
   * @param {Object} manifest Manifest of assets to load
   * @return {Promise} Promise that is fulfilled when the assets are loaded
   * @example
   * let manifest = {
   *   images: {
   *     'imgs/all.png': {
   *       'img-1': {
   *         x: 0,
   *         y: 0,
   *         w: 16,
   *         h: 16,
   *         scale: 1
   *       }
   *     }
   *   },
   *   data: ['data/level.json']
   * }
   */
  load(manifest) {
    let ps = [];
    if (manifest.images) {
      let srcs = Object.keys(manifest.images);
      for (let src of srcs) {
        let path = this.prefix + src;
        ps.push(loadImage().then(img => {
          let defs = manifest.images[src];
          let names = Object.keys(defs);
          for (let name of names) {
            let def = defs[name];
            let can = document.createElement('canvas');
            let scale = def.scale || 1;
            let w = can.width = scale * def.w;
            let h = can.height = scale * def.h;
            let ctx = can.getContext('2d');
            ctx.imageSmoothingEnabled = this._smoothImage;
            ctx.drawImage(img, def.x, def.y, def.w, def.h, 0, 0, w, h);
            this.images.set(name, can);
          }
        }));
      }
    }
    if (manifest.data) {
      for (let src of manifest.data) {
        let path = this.prefix + src;
        ps.push(loadData(path).then(data => this.data.set(path, data)));
      }
    }
    return Promise.all(ps);
  }
}
