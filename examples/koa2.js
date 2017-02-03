'use strict';

let koa = require('koa-next');
let swagger = require('../');
let port = process.env.PORT || 5000;

let app = new Koa();

app.use(swagger.koa.next({
  path: './swagger.json', // Path to swagger file
  prefix: '', // Prefix applied to all routes
  assets: '/_swagger_', // Prefix for all assets, appended to prefix
  route: '/swagger', // Router to serve documentation
  css: false, // Path to the css OR css string
  unauthorized: false, // Unauth handler
  authentication: {
    sources: ['query', 'body'], // Accepted sources of auth
    key: false, // Key for the auth
    value: false // Value for the auth
  }
});

app.use((ctx, next) => {
  this.body = 'OK';
});

app.listen(port);
console.log('Listening on port ' + port);
