'use strict';

let Koa = require('koa');
// let koa = require('koa-next');
let swagger = require('../');
let port = process.env.PORT || 5000;

let app = new Koa();

app.use(swagger.koa.next({
  path: __dirname + '/swagger.json',
  authentication: {
    sources: ['query'],
    key: 'foo',
    value: 'bar'
  },
  unauthorized: (ctx, next) => {
    ctx.status = 401;
    ctx.body = { error: 'Not authorized' };
  }
}));

app.use((ctx, next) => {
  this.body = 'OK';
});

app.listen(port);
console.log('Listening on port ' + port);
