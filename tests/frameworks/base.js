'use strict';

let mocha = require('mocha');
let expect = require('chai').expect;

const BaseFramework = require('../../.').frameworks.base;
const SWAG_PATH = __dirname + '/../swagger.json';

describe('Frameworks', () => {
  describe('base', () => {
    describe('constructor', () => {
      it('should accept a path to a swagger doc', () => {
        let findNestedProp = (obj) => obj['paths']['/']['get']['description'];
        let expected = require(SWAG_PATH);
        let f1 = new BaseFramework(SWAG_PATH);
        expect(f1.config.swagger).to.be.an('object');
        expect(findNestedProp(f1.config.swagger)).to.equal(findNestedProp(expected));
        let f2 = new BaseFramework({ path: SWAG_PATH });
        expect(f2.config.swagger).to.be.an('object');
        expect(findNestedProp(f2.config.swagger)).to.equal(findNestedProp(expected));
      });
      it('should should accept a swagger object', () => {
        let f = new BaseFramework({ swagger: {} });
        expect(f.config.swagger).to.be.an('object');
      });
      it('should throw an error without valid swagger docs', () => {
        expect(() => { new BaseFramework() }).to.throw(Error);
        expect(() => { new BaseFramework('/asdf/asdf') }).to.throw(Error);
        expect(() => { new BaseFramework('fdas') }).to.throw(Error);
        expect(() => { new BaseFramework({ path: 'fdas' }) }).to.throw(Error);
        expect(() => { new BaseFramework({ swagger: undefined  }) }).to.throw(Error);
      });
    });

    describe('.applyDefaults', () => {
      let framework = new BaseFramework({ swagger: {} });
      let defaults = framework.getDefaults();
      it('should return a default constructor if none is passed', () => {
        let def = framework.applyDefaults();
        expect(Object.keys(def)).to.have.length.above(0); // sanity
        expect(def).to.deep.equal(defaults);
      });
      it('should override properties of the default if a constructor is passed', () => {
        expect(framework.applyDefaults({ css: true }).css).to.be.true
      });
    });

    describe('.isAuthorized', () => {
      let buildAuth = (sources, key, value) => {
        return (new BaseFramework({
          swagger: {},
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
        let framework = new BaseFramework({ swagger: {} });
        expect(framework.unauthorized).to.throw(Error);
      });
      it('should allow override via inheritance ', () => {
        class TestFramework extends BaseFramework {
          unauthorized () { return true; }
        };
        let framework = new TestFramework({ swagger: {} });
        expect(framework.unauthorized).to.not.throw(Error);
      });
      it('should accept override in constructor', () => {
        let framework = new BaseFramework({ swagger: {}, unauthorized: () => true });;
        expect(framework.unauthorized()).to.be.true;
      });
    });
  });
})
