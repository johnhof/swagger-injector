var express      = require('express');
var swagger      = require('swagger-injector');
var cookieParser = require('cookie-parser');
var app          = express();
var port = process.env.NODE_ENV || 5000;

app.use(cookieParser());
app.use(swagger.express({
  restrict: {
    key: {
      name: 'swag',
      value: 'swagbag'
    }
  },
  unauthorized: function (req, res) {
    res.status(403).send('Forbidden');
  }
}));

app.use(function (req, res, next) {
  res.send('OK');
});

app.listen(port);
console.log('Listening on port ' + port);
