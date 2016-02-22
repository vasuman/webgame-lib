function loadImage(src) {
  let img = new Image();
  img.src = src;
  return new Promise((resolve) => {
    img.addEventListener('load', () => {
      resolve(img);
    });
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
   *   }
   * }
   */
  load(manifest) {
    let ps = [];

    // load images
    let srcs = Object.keys(manifest.images);
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
          ctx.imageSmoothingEnabled = this._smoothImage;
          ctx.drawImage(img, def.x, def.y, def.w, def.h, 0, 0, w, h);
          this.images.set(name, can);
        }

      });

      ps.push(p);
    }

    return Promise.all(ps);
  }

}

