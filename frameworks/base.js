'use strict';

const PATH = require('path');
const FS = require('fs');
const FileCache = require('../lib/file_cache');

const DEFAULTS = {
  path: './swagger.json', // Path to swagger file
  swagger: false, // swagger json
  prefix: '', // Prefix applied to all routes
  assets: '/_swagger_', // Prefix for all assets, appended to prefix
  route: '/swagger', // Router to serve documentation
  css: false, // Path to the css OR css string
  unauthorized: false, // Unauth handler
  authentication: {
    sources: ['query', 'body'], // Accepted sources of auth
    key: false, // Key for the auth
    value: false // Value for the auth
  }
};

class BaseFramework {
  constructor(config={}) {
    config = (typeof config === 'string') ? { path: config } : config;
    if (!(config.path || config.swagger)) throw Error('No swagger provided to the constructor');
    this.config = this.applyDefaults(config);
    this.assets = this.prefix + this.assets;
    this.route = this.prefix + this.route;
    this.fileCache = new FileCache();
    if (this.config.unauthorized) this.unauthorized = this.config.unauthorized;
    this.session = {
      name: 'swagger-injector',
      value: this.config.authentication && this.config.authentication.value
    }

    if (this.config.swagger) return;
    let swag = this.config.path;
    let swagPath = PATH.resolve(swag);
    if (swagPath) swag = FS.readFileSync(swagPath);
    if (swag) this.config.swagger = JSON.parse(swag);
    if (!this.config.swagger) throw Error('Failed to find swagger json from config');
  }

  getDefaults () {
    return DEFAULTS;
  }

  applyDefaults (config={}) {
    let result = {};
    let propNames = Object.keys(DEFAULTS);
    for (let n of propNames) result[n] = config[n] || DEFAULTS[n];
    return result;
  }

  isAuthorized (sources) {
    let auth = this.config.authentication || {};
    let srcs = auth.sources || [];

    // No auth source specified, OR neither key or value were spefified
    if (!srcs.length || !(auth.key || auth.value)) return true;

    // Check auth for every approved source
    for (let sourceName of srcs) {
      let src = sources[sourceName];

      // Make sure the source is approved
      if (!src) continue;

      // Make sure the key exists in the source
      if (!(auth.key in src)) continue;

      // if a value is required, make sure it match's the expected
      if (auth.value && src[auth.key] !== auth.value) continue;

      // Success!
      return true;
    }
    return false;
  }

  isSwaggerSourcePath (path) {
    return (path === `${this.config.prefix}/swagger.json`);
  }

  isDocumentPath (path) {
    return (path.indexOf(this.config.route) === 0);
  }

  isAssetPath (path) {
    return (path.indexOf(this.config.assets) === 0);
  }

  isCustomCssPath (path) {
    return (path.indexOf(this.config.assets) === 0);
  }

  unauthorized() {
    throw Error('No unauthorized handler defined for the framework');
  }

  hasSession() {
    throw Error('No unauthorized handler defined for the framework');
  }

  createSession() {
    throw Error('No unauthorized handler defined for the framework');
  }

  middleware() {
    throw Error('No middleware function defined for the framework');
  }
}

module.exports = BaseFramework
