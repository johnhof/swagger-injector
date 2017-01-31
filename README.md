# Swagger Injector

Adaptation of [swagger ui](https://github.com/swagger-api/swagger-ui) to render the swagger view of a server's swgger documentation for a specified route.

If you're unfamiliar with swagger, I highly recommend [checking it out](http://swagger.io/).

<img src="http://i.imgur.com/lR2qpnE.png" width="600">

# 3.x

3.x is designed to support koa2

# Key

- [Usage](#usage)
  - [Koa](#koa)
  - [Express](#express)
- [Defaults](#defaults)
- [Configuration](#configuration)
  - [config.swagger](#configswagger)
  - [confi.route](#configroute)
  - [config.unauthorized](#configunauthorized)
  - [config.staticDir](#configstaticdir)
  - [config.css](#configcss)
  - [config.resctrict](#configrestrict)
    - [config.restrict.accept](#configrestrictaccept)
    - [config.restrict.key](#configrestrictkey)
    - [config.restrict.key.name](#configrestrictkeyname)
    - [config.restrict.key.value](#configrestrictkeyvalue)

# Usage

## Koa

* Assume ./swagger.json is a valid json file
* [Working example](https://github.com/johnhof/swagger-injector/tree/master/examples/koa.js)
  * Run `$ npm install && node --harmony /examples/koa`
  * Request `localhost:5000/swagger`

```javascript
var koa     = require('koa');
var swagger = require('swagger-injector');
var app     = koa();

app.use(swagger.koa());
app.use(function *() { this.body = 'OK'; });
app.listen(5000);

```

## Express

* Assume ./swagger.json is a valid json file
* [Working example](https://github.com/johnhof/swagger-injector/tree/master/examples/express.js)
  * Run `$ npm install && node /examples/express`
  * Request `localhost:5000/swagger`

```javascript
var express      = require('express');
var swagger      = require('swagger-injector');
var cookieParser = require('cookie-parser');
var app          = express();

app.use(cookieParser());
app.use(swagger.express());
app.use(function (req, res, next) { res.send('OK'); });
app.listen(5000);
```


# Defaults

Swagger applies the following config by default. Any config setting can be overwritten.

```javascript
{
  swagger      : './swagger.json', // location of swagger doc json
  route        : '/swagger', // route where the view is returned
  restrict     : false
}
```

# Configuration

The config object should be passed into the middleware constructor when the framework type is called.

```javascript
var expressMiddleware = swagger.express({ /* Some config settings */ });
var koaMiddleware = swagger.koa({ /* Some config settings */ });
```

## config.swagger

- Location of the swagger documentation json file
- Can be relative or absolute (`./` for relative)
- Can be a javascript object following the swagger structure
- Defaults to `./swagger.json`

```javascript
config.swagger = './foo/documentation.json';
// OR
config.swagger = require('/some/swagger/compiler');
```

## config.route

- Route that the swagger view will be returned from
- Defaults to `/swagger`

```javascript
config.route = '/foo/bar/swag';
```

## config.unauthorized

- Callback to handle unauthorized requests
- accepts standard parameters fro framework middleware
- Defaults to return 403 and the string `"Forbidden"`

```javascript
// koa
config.unathorized = function () {
  this.status = 401;
  this.body = 'Come back when you have a key';
};

// express
config.unauthorized = function (req, res) {
    res.status(401).send('Come back when you have a key');
};
```

## config.staticDir

- Static files directory of swagger-ui
- Defaults to './dist' directory in swagger-injector module

```javascript
config.staticDir = process.cwd() + '/swagger-ui'
```

## config.css

- Css string to inject into the view
- Defaults to empty
- Accepts war css string, or path to css file

```javascript
config.css = './foo/path/swagger.css';
```


## config.restrict

- Restrictions for swagger access
- Defaults to allow any request access
- If a valid restriction setting, `config.unauthorized` will be called on failure to pass authentication
- More complex authorization than a key/value pair must be handled by the server!

```javascript
config.restrict = {
  accept : ['query'],
  key    : {
    name : 'my-key-name',
    value : 'all the access'
  }
};
```

## config.restrict.accept

- Array of accepted containers to pull authorization from
- Allows: `query`, `body`, `header`
- Defaullt to allow all containers

```javascript
config.restrict.accept = ['query']; // allow query parameters only
```
## config.restrict.key

- Key value pair definition for restriction
- Accepts a string for value definition, or an object to define both the name and the value

```javascript
consig.restrict.key = 'such secure'; // accepts `swagger-key=such secure`
// OR
config.swagge.restrict.key = {
  name : 'swag',
  value : 'such secure'
}; // accepts `swag=such secure`
```

## config.restrict.key.name

- Name of the key-value to accept
- Defaults to `swagger-key`

```javascript
config.restrict.key.name = 'my-key';
```

## config.restrict.key.value

- Value of the key-value to accept

```javascript
config.restrict.key.value = 'such secure, much secret';
```

# Author

  - [John Hofrichter](https://github.com/johnhof)

# License

  MIT
