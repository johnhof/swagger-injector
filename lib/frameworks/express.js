'use strict';

let helpers = require('../helpers');
let _       = require('lodash');

module.exports = function (config) {
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
    if (req.path.indexOf('/_swagger_/') === 0) {
      let truePath = req.path.replace(/\/_swagger_\//, '');
      if (~req.path.indexOf('.css')) res.set('Content-Type', 'text/css');
      if (truePath === '_custom_.css') {
        res.send(config.css);
      } else {
        res.send(helpers.staticFile(truePath), config.staticDir);
      }

      return;
    }

    // swagger json
    if (req.path === '/swagger.json') {
      res.set('Content-Type', 'application/json');
      if (_.isString(config.swagger)) {
        res.send(helpers.staticFile(config.swagger), config.staticDir);
      } else {
        res.send(config.swagger);
      }

      return;
    }

    // index file
    if (req.path === config.route) {
      res.set('Content-Type', 'text/html');
      res.send(helpers.staticFile('index.html'), config.staticDir);
      return;
    }

    return next();
  };

};
