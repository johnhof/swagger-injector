'use strict';

const BaseFramework = require('./base');

class Koa2Framework extends BaseFramework {
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

  serveFile (ctx, path, type) {
    // Check if there is a valid session or valid credentials
    if (this.hasSession(ctx) || this.isAuthorized(ctx)) this.createSession(ctx);
    else {
      this.unauthorized(ctx);
      return Promise.resolve();
    }

    if (type) ctx.set('Content-Type', type);
    let file = this.fileCache.get(path);
    if (file) ctx.body = file;
    return Promise.resolve();
  }

  middleware () {
    return (ctx, next) => {
      // Serve up documentation html
      if (this.isDocumentPath(ctx.path)) {
        return this.serveFile(ctx, ctx.path, 'text/html');

      // Serve up swagger source json
      } else if (this.isSwaggerSourcePath(ctx.path)) {
        return this.serveFile(ctx, ctx.path, 'application/json');

      // Serve up custom css
      } else if (this.isCustomCssPath(ctx.path)) {
        ctx.set('Content-Type', 'text/css');
        ctx.body = this.css;
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

module.exports = Koa2Framework;
