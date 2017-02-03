'use strict';

const FileCache = require('../lib/file_cache');
const BaseFramework = require('./base');

class Koa2Framework extends BaseFramework {
  constructor (config={}) {
    super(config={});
    this.fileCache = new FileCache();
  }

  unauthorized (ctx, next) {
    ctx.body = 'Not Authorized'
    ctx.status = 401;
    return Promise.resolve();
  }

  hasSession(ctx) {
    return ctx.cookies.get(this.session.name) === this.session.value;
  }

  createSession () {
    ctx.cookies.set(this.session.name, this.session.value);
  }

  serveFile (ctx, path, type) {
    if (type) ctx.set('Content-Type', type);
    let file = this.fileCache.get(path);
    if (file) ctx.body = file;
  }

  middleware () {
    return (ctx, next) => {
      // Check if there is a valid session or valid credentials
      if (this.hasSession(ctx) || this.isAuthorized(ctx)) this.createSession(ctx);
      else return this.unauthorized(ctx, next)

      // Serve up documentation html
      if (this.isDocumentPath(ctx.path)) {
        this.serveFile(ctx, path, 'text/html');

      // Serve up swagger source json
      } else if (this.isSwaggerSourcePath(ctx.path)) {
        this.serveFile(ctx, path, 'application/json');

      // Serve up custom css
      } else if (this.isCustomCssPath(ctx.path)) {
        ctx.set('Content-Type', 'text/css');
        ctx.body = this.css;

      // Serve up assets
      } else if (this.isAssetPath(ctx.path)) {
        let type = (ctx.path.indexOf('.css') >= 0) ? 'text/css' : undefined
        this.serveFile(ctx, path, type);

      } else {
        return next();
      }
    }
  }
}

module.exports = Koa2Framework;
