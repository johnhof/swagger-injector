'use strict';

const BaseFramework = require('./base');

class Koa2Framework extends BaseFramework {
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

  middleware () {
    return (ctx, next) => {
      // Check if there is a valid session or valid credentials
      if (this.hasSession(ctx) || this.isAuthorized(ctx)) this.createSession(ctx);
      else return this.unauthorized(ctx, next)
    }
  }
}

module.exports = Koa2Framework;
