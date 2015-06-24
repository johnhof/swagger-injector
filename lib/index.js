var _       = require('lodash');
var helpers = require('./helpers');


var pathSplit = module.parent.filename.split('/');
pathSplit.pop();
const relPath = pathSplit.join('/');

// Duck Typing
//
module.exports = function (app, config) {
  if (!app && config) { throw new Error ('Both app and config are required'); }

  var isKao = app.hasOwnProperty('context');
  var middleware = isKao ? require('./frameworks/koa') : require('./frameworks/express');
  app.use(middleware(config.client, applyConfig(config)));
}

// Express Specific
//
module.exports.express = function (config) {
  if (!config) { throw new Error ('Config is required'); }
  config = applyConfig(config);
  return require('./frameworks/express')(config);

}

// Koa Specific
//
module.exports.koa = function (config) {
  if (!config) { throw new Error ('config is requried'); }
  config = applyConfig(config);
  return require('./frameworks/koa')(config);
}


// Apply config
//
// must return:
// {
//   swagger      : String, // location of docs
//   route        : String, // route to return the docs for
//   unAuthorized : Function, // funciton to call if unauthorized
//   restrict     : {
//     accept : Array // array of options 'header, 'body', 'query'
//     key    : {
//       name  : String,
//       value : String
//     }
//   } || false
// }
var applyConfig = function (config) {
  config = _.clone(config || {}, true);

  // authorization
  if (config.restrict) {
    if (_.isString(config.restrict.key)) {
      config.restrict.key = {
        name  : 'swagger-key',
        value : config.restrict.key
      }
    } else if (_.isObject(config.restrict.key)) {
      config.restrict.key = {
        name  : config.restrict.key.name || 'swagger-key',
        value : config.restrict.key.value
      }
    }
  } else {
    config.restrict = false;
  }

  // accept authorization source
  var acceptSet = ['header', 'body', 'query'];
  if (_.isArray(config.restrict.accept)) {
    config.restrict.accept = _.filter(config.restrict.accept, function (val) {
      return _.find(acceptSet, function (acceptVal) { return val === acceptVal; });
    });
  } else {
    config.restrict.accept = acceptSet;
  }

  // swagger source
  config.swagger = config.swagger || './swagger.json'
  if (_.isString(config.swagger)) {
    config.swagger = helpers.pathToAbsolute(relPath, config.swagger);
    config.swaggerJson = require(config.swagger);
  } else {
    config.swaggerJson = config.swagger;
  }
  if (!_.isObject(config.swaggerJson)) { throw new Error('No swagger document found'); }

  // route access
  config.route = config.route || 'swagger';
  config.route = config.route.indexOf('/') === 0 ? config.route : '/' + config.route;

  // cookie
  config.cookieName = config.cookieName || 'swagger-access-key';

  return config;
}
