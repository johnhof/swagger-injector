var helpers = require('../helpers');

module.exports = function (config) {
  var unauthHandler = config.unauthorized || function (req, res, next) {
    res.status(403).send('Forbidden');
  }

  return function (req, res, next) {
      // handle access management
    if (config.restrict) {
      var accessCookie = req.cookies && req.cookies[config.cookieName];
      if (!helpers.isAuthorized(config, req, accessCookie) && (req.path === config.route || req.path === '/swagger.json')) {
        return unauthHandler(req, res);
      } else {
        res.cookie(config.cookieName, config.restrict.key.value);
      }
    }

    // resource
      if (req.path.indexOf('/_swagger_/') === 0) {
      var truePath = req.path.replace(/\/_swagger_\//, '');
      if (~req.path.indexOf('.css')) { res.set('Content-Type', 'text/css'); }
      res.send(helpers.staticFile(truePath));
      return;
    }

    // swagger json
    if (req.path === '/swagger.json') {
      res.set('Content-Type', 'application/json');
      res.send(helpers.staticFile(config.swagger));
      return;
    }

    // index file
    if (req.path === config.route) {
      res.set('Content-Type', 'text/html');
      res.send(helpers.staticFile('index.html'));
      return;
    }

    return next();
  }

}
