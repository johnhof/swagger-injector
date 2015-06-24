var koa     = require('koa');
var swagger = require('swagger-injector');
var app     = koa();

app.use(swagger.koa({
  restrict : {
    key : {
      name  : 'swag',
      value : 'swagbag'
    }
  },
  unauthorized : function *() {
    this.status = 403;
    this.body   = 'Forbidden';
  }
}));

app.use(function *() {
  this.body = 'OK';
});

app.listen(5000);
