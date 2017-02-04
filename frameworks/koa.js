'use strict';

const BaseFramework = require('./base');

class KoaFramework extends BaseFramework {
  constructor (config={}) {
    super(config);
  }

  unauthorized (ctx) {
    ctx.body = 'Not Authorized'
    ctx.status = 401;
    return Promise.resolve();
  }

  hasSession(ctx) {
    return ctx.cookies.get(this.session.name) === this.session.value;
  }

  createSession (ctx) {
    ctx.cookies.set(this.session.name, this.session.value);
  }

  serveFile (ctx, path, type, injection) {
    // Check if there is a valid session or valid credentials
    if (this.hasSession(ctx) || this.isAuthorized(ctx)) this.createSession(ctx);
    else {
      this.unauthorized(ctx);
      return Promise.resolve();
    }

    if (type) ctx.set('Content-Type', type);
    let file = this.fileCache.get(this.buildDistPath(path), injection);
    if (file) ctx.body = file;
    return Promise.resolve();
  }

  middleware () {
    return (ctx, next) => {

      // Serve up documentation html
      if (this.isDocumentPath(ctx.path)) {
        return this.serveFile(ctx, '/index.html', 'text/html', {
          prefix: this.config.prefix
        });

      // Serve up swagger source json
      } else if (this.isSwaggerSourcePath(ctx.path)) {
        ctx.set('Content-Type', 'application/json');
        ctx.body = this.config.swagger;
        return Promise.resolve();

      // Serve up custom css
      } else if (this.isCustomCssPath(ctx.path)) {
        ctx.set('Content-Type', 'text/css');
        ctx.body = this.config.css;
        return Promise.resolve();

      // Serve up assets
      } else if (this.isAssetPath(ctx.path)) {
        let type = (ctx.path.indexOf('.css') >= 0) ? 'text/css' : undefined
        return this.serveFile(ctx, ctx.path, type);

      } else {
        return next();
      }
    }
  }
}

module.exports = KoaFramework;
