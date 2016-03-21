/* eslint-env mocha */

import chai from 'chai';

import {Vec} from '../src/geom.js';
import Camera from '../src/camera.js';

chai.should();

describe('Camera', function() {
  const w = 400;
  const h = 300;
  let camera;

  beforeEach(function() {
    camera = new Camera(w, h);
  });

  describe('#center()', function() {
    it('should respect bounds', function() {
      camera.bounds.set(0, 0, 800, 600);
      camera.center = new Vec(-300, -300);
      camera.center.x.should.be.equal(0);
      camera.center.y.should.be.equal(0);
      camera.center = new Vec(1000, 1000);
      camera.center.x.should.be.equal(800);
      camera.center.y.should.be.equal(600);
    });
  });

  describe('#pan()', function() {
    it('should invert direction of translation', function() {
      camera.center = new Vec(100, 100);
      camera.panSpeed = camera.z = 1;
      camera.pan(10, 10);
      camera.center.x.should.be.equal(90);
      camera.center.y.should.be.equal(90);
    });
  });

})
