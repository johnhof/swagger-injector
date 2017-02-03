'use strict';

let helpers = require('../helpers');
let _       = require('lodash');

module.exports = function (config) {
  let prefixRegex = new RegExp('{{prefix}}', 'g');
  let indexBuffer = helpers.staticFile('index.html', config.staticDir);
  let indexHtml = indexBuffer.toString().replace(prefixRegex, config.prefix);
  indexBuffer = new Buffer(indexHtml);
  let unauthHandler = config.unauthorized || function (req, res, next) {
    res.status(403).send('Forbidden');
  };

  return function (req, res, next) {
    // handle access management
    if (config.restrict) {
      let accessCookie = req.cookies && req.cookies[config.cookieName];
      if (helpers.isAuthorized(config, req, accessCookie)) {
        res.cookie(config.cookieName, config.restrict.key.value);
      } else if (req.path === config.route || req.path === '/swagger.json') {
        return unauthHandler(req, res);
      }
    }

    // resource
    if (config.swagPrefix.test(this.path)) {
      let truePath = this.path.replace(config.swagPrefix, '');
      if (~req.path.indexOf('.css')) res.set('Content-Type', 'text/css');
      if (truePath === '_custom_.css') {
        res.send(config.css);
      } else {
        res.send(helpers.staticFile(truePath), config.staticDir);
      }

      return;
    }

    // swagger json
    if (this.path === (config.prefix + '/swagger.json')) {
      res.set('Content-Type', 'application/json');
      if (_.isString(config.swagger)) {
        res.send(helpers.staticFile(config.swagger), config.staticDir);
      } else {
        res.send(config.swagger);
      }

      return;
    }

    // index file
    if (this.path === (config.prefix + config.route)) {
      res.set('Content-Type', 'text/html');
      this.body = indexHtml;
      return;
    }

    return next();
  };

};
