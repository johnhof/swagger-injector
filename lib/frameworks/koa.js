'use strict';

let helpers = require('../helpers');
let _       = require('lodash');

module.exports = function (config) {
  let prefixRegex = new RegExp('{{prefix}}', 'g');
  let indexBuffer = helpers.staticFile('index.html', config.staticDir);
  let indexHtml = indexBuffer.toString().replace(prefixRegex, config.prefix);
  indexBuffer = new Buffer(indexHtml);
  let unauthHandler = config.unauthorized || function *() {
    this.status = 403;
    this.body   = 'Forbidden';
  };

  return function *(next) {
    // handle access management
    if (config.restrict) {
      let accessCookie = this.cookies.get(config.cookieName);
      if (helpers.isAuthorized(config, this.request, accessCookie)) {
        this.cookies.set(config.cookieName, config.restrict.key.value);
      } else if (this.path === config.route || this.path === '/swagger.json') {
        return yield unauthHandler.apply(this);
      }
    }

    // resource
    if (config.swagPrefix.test(this.path)) {
      let truePath = this.path.replace(config.swagPrefix, '');
      if (~this.path.indexOf('.css')) this.set('Content-Type', 'text/css');
      if (truePath === '_custom_.css') {
        this.body = config.css;
      } else {
        this.body = helpers.staticFile(truePath, config.staticDir);
      }

      return;
    }

    // swagger json
    if (this.path === (config.prefix + '/swagger.json')) {
      this.set('Content-Type', 'application/json');
      if (_.isString(config.swagger)) {
        this.body = helpers.staticFile(config.swagger, config.staticDir);
      } else {
        this.body = config.swagger;
      }

      return;
    }

    // index file
    if (this.path === (config.prefix + config.route)) {
      this.set('Content-Type', 'text/html');
      this.body = indexHtml;
      return;
    }

    yield next;
  };

};
