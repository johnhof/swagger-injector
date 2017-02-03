'use strict';

let Koa = require('koa');
// let koa = require('koa-next');
let swagger = require('../');
let port = process.env.PORT || 5000;

let app = new Koa();

app.use((ctx, next) => {
  console.log(`--> ${ctx.path}`)
  return next().then(() => console.log(`<-- ${ctx.path} ${ctx.status}`));
})

app.use(swagger.koa({
  // debug: true,
  prefix: '/v1',
  css: '.info_title {font-size: 50px !important; }',
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
  return next();
});

app.listen(port);
console.log('Listening on port ' + port);
