var express      = require('express');
var swagger      = require('swagger-injector');
var cookieParser = require('cookie-parser');
var app          = express();

app.use(cookieParser());
app.use(swagger.express({
  restrict : {
    key : {
      name  : 'swag',
      value : 'swagbag'
    }
  },
  unauthorized : function (req, res) {
    res.status(403).send('Forbidden');
  }
}));

app.use(function (req, res, next) {
  res.send('OK');
});

app.listen(5000);
