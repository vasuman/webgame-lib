/* eslint-env mocha */

import chai from 'chai';

import {Vec, Rect} from '../src/geom.js';

chai.should();

describe('Vec', function() {
  describe('#add()', function() {
    it('should add', function() {
      let a = new Vec(2, 3);
      let b = new Vec(7, 9);
      a.add(b);
      a.x.should.be.equal(9);
      a.y.should.be.equal(12);
    })
  });

  describe('#sub()', function() {
    it('should subtract', function() {
      let a = new Vec(2, 3);
      let b = new Vec(7, 9);
      a.sub(b);
      a.x.should.be.equal(-5);
      a.y.should.be.equal(-6);
    })
  });

  describe('#r()', function() {
    it('should get the magnitude', function() {
      let a = new Vec(3, 4);
      a.r.should.be.equal(5);
    });
  });
});

describe('Rect', function() {
});
