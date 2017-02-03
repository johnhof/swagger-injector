# Swagger Injector

Adaptation of [swagger ui](https://github.com/swagger-api/swagger-ui) to render the swagger view of a server's swagger documentation for a specified route.

If you're unfamiliar with swagger, I highly recommend [checking it out](http://swagger.io/).

<img src="http://i.imgur.com/lR2qpnE.png" width="600">

# Key

- [Usage](#usage)
  - [Koa](#koa)
  - [Express](#express)
- [Defaults](#defaults)
- [Configuration](#configuration)

# Usage

## Koa

**Build for ^2.x**

* Assume ./swagger.json is a valid json file
* [Working example](https://github.com/johnhof/swagger-injector/tree/master/examples/koa.js)
  * Run `$ npm install && node examples/koa`
  * Request `localhost:3000/swagger`

```javascript
let Koa = require('koa');
let swagger = require('swagger-injector');

let app = new Koa();

app.use(swagger.koa({
  path: `${__dirname}/swagger.json`,
}));

app.listen(3000);
```

## Express

* Assume ./swagger.json is a valid json file
* NOTE: authentication requires `cookie-parser`
* [Working example](https://github.com/johnhof/swagger-injector/tree/master/examples/express.js)
  * Run `$ npm install && node examples/express`
  * Request `localhost:3000/swagger`

```javascript
let express = require('express');
let cookieParser = require('cookie-parser');
let swagger = require('swagger-injector');

let app = express();

app.use(cookieParser()); // REQUIRED
app.use(swagger.express({
  path: `${__dirname}/swagger.json`
}));

app.listen(3000);
```

# Configuration

The following configuration example is a copy of the default configuration

```javascript
{
  path: './swagger.json', // Path to swagger file
  swagger: false, // swagger json. If not set, it is read from the `path` file
  prefix: '', // Prefix applied to all routes
  assets: '/_swagger_', // Prefix for all assets, appended to prefix
  route: '/swagger', // Router to serve documentation
  css: false, // Path to the css OR css string
  unauthorized: false, // Unauth handler
  dist: '/dist', // Path to dist directory
  authentication: {
    sources: ['query', 'body'], // Accepted sources of auth
    key: false, // Key for the auth
    value: false // Value for the auth
  }
}
```

# Author

  - [John Hofrichter](https://github.com/johnhof)

# License

  MIT
