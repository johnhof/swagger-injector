'use strict';

const DEFAULTS = {
  path: './swagger.json', // Path to swagger file
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
    this.config = this.applyDefaults(config);
    if (this.config.unauthorized) this.unauthorized = this.config.unauthorized;
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

  unauthorized() {
    throw Error('No unauthorized handler defined for the framework');
  }

  middleware() {
    throw Error('No middleware function defined for the framework');
  }
}

module.exports = BaseFramework
