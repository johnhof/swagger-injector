'use strict';

const BaseFramework = require('./base');

class ExpressFramework extends BaseFramework {
  constructor (config={}) {
    super(config);
  }

  unauthorized (req, res) {
    res.status(401).send('Not authorized');
  }

  unauthorized (req, res) {
    res.status(401).send('Not authorized');
  }

  forbidden (req, res) {
    res.status(403).send('Forbidden');
  }

  hasSession(req, res) {
    return req.cookies[this.session.name] === this.session.value;
  }

  createSession (req, res) {
    res.cookie(this.session.name, this.session.value);
  }

  serveFile (req, res, path, type, injection) {
    // Check if there is a valid session or valid credentials
    if (this.hasSession(req, res) || this.isAuthorized(req, res)) this.createSession(req, res);
    else {
      this.unauthorized(req, res);
      return Promise.resolve();
    }

    if (type) res.set('Content-Type', type);
    
    let filePath = this.buildDistPath(path);
    if (!this.isDistPath(filePath)) {
      this.forbidden(req, res);
      return Promise.resolve();
    }
    let file = this.fileCache.get(filePath, injection);
    if (file) res.send(file);
  }

  middleware () {
    return (req, res, next) => {

      // Serve up documentation html
      if (this.isDocumentPath(req.path)) {
        return this.serveFile(req, res, '/index.html', 'text/html', {
          prefix: this.config.prefix
        });

      // Serve up swagger source json
      } else if (this.isSwaggerSourcePath(req.path)) {
        res.set('Content-Type', 'application/json');
        res.send(this.config.swagger);

      // Serve up custom css
      } else if (this.isCustomCssPath(req.path)) {
        res.set('Content-Type', 'text/css');
        res.send(this.config.css);
      // Serve up assets
      } else if (this.isAssetPath(req.path)) {
        let type = (req.path.indexOf('.css') >= 0) ? 'text/css' : undefined
        return this.serveFile(req, res, req.path, type);

      } else {
        return next();
      }
    }
  }
}

module.exports = ExpressFramework;
