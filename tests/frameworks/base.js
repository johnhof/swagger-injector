'use strict';

let mocha = require('mocha');
let expect = require('chai').expect;

let BaseFramework = require('../../.').frameworks.base;

describe('Frameworks', () => {
  describe('base', () => {
    describe('.applyDefaults', () => {
      let framework = new BaseFramework();
      let defaults = framework.getDefaults();
      it('should return a default constructor if none is passed', () => {
        let def = framework.applyDefaults();
        expect(Object.keys(def)).to.have.length.above(0); // sanity
        expect(def).to.deep.equal(defaults);
      });
      it('should override properties of the defualt if a constructor is passed', () => {
        expect(framework.applyDefaults({ css: true }).css).to.be.true
      });
    });
    describe('.isAuthorized', () => {
      let buildAuth = (sources, key, value) => {
        return (new BaseFramework({
          authentication: { sources, key, value }
        }));
      }
      it('should return false for failed authentication', () => {
        expect(buildAuth(['query'], 'foo', 'bar').isAuthorized({
          query: { foo: 'dar' }
        })).to.be.false;
      });
      it('should return true for passed authentication', () => {
        expect(buildAuth(['query'], 'foo', 'bar').isAuthorized({
          query: { foo: 'bar' }
        })).to.be.true;
      });
      it('should dynamically use source to authenticate', () => {
        expect(buildAuth(['fizz'], 'foo', 'bar').isAuthorized({
          fizz: { foo: 'bar' }
        })).to.be.true;
      });
      it('should allow for key only authentication', () => {
        expect(buildAuth(['query'], 'foo').isAuthorized({
          query: { foo: undefined }
        })).to.be.true;
      });
      it('should allow for key/value authentication', () => {
        expect(buildAuth(['query'], 'foo', 'bar').isAuthorized({
          query: { foo: 'bar' }
        })).to.be.true;
      });
    });
    describe('.unauthorized', () => {
      it('should throw error if not defined', () => {
        let framework = new BaseFramework();
        expect(framework.unauthorized).to.throw(Error);
      });
      it('should allow override via inheritance ', () => {
        class TestFramework extends BaseFramework {
          unauthorized () { return true; }
        };
        let framework = new TestFramework();
        expect(framework.unauthorized).to.not.throw(Error);
      });
      it('should accept override in constructor', () => {
        let framework = new BaseFramework({ unauthorized: () => true });;
        expect(framework.unauthorized()).to.be.true;
      });
    });
  });
})
