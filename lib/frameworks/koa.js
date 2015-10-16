var helpers = require('../helpers');
var _       = require('lodash');

module.exports = function (config) {
  var unauthHandler = config.unauthorized || function *() {
    this.status = 403;
    this.body   = 'Forbidden';
    console.log(this.response.header);
  };

  return function *(next) {
    // handle access management
    if (config.restrict) {
      var accessCookie = this.cookies.get(config.cookieName);
      if (helpers.isAuthorized(config, this.request, accessCookie)) {
        this.cookies.set(config.cookieName, config.restrict.key.value);
      } else if (this.path === config.route || this.path === '/swagger.json') {
        return yield unauthHandler.apply(this);
      }
    }

    // resource
    if (this.path.indexOf('/_swagger_/') === 0) {
      var truePath = this.path.replace(/\/_swagger_\//, '');
      if (~this.path.indexOf('.css')) { this.set('Content-Type', 'text/css'); }

      this.body = helpers.staticFile(truePath);
      return;
    }

    // swagger json
    if (this.path === '/swagger.json') {
      this.set('Content-Type', 'application/json');
      if (_.isString(config.swagger)) {
        this.body = helpers.staticFile(config.swagger);
      } else {
        this.body = config.swagger;
      }

      return;
    }

    // index file
    if (this.path === config.route) {
      this.set('Content-Type', 'text/html');
      this.body = helpers.staticFile('index.html');
      return;
    }

    yield next;
  };

};
