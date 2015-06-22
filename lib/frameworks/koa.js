var helpers = require('./helpers');

function (config) {
  var ctx           = this;
  var unAuthHandler = config.unAuthorized || function *() {
    ctx.status = 401;
    ctx.body   = 'Not authorized';
  }
  return function *(next) {
    if (this.pathname === config.route) {
      if (!helpers.isAuthorized(config, this.request)) {
        return yield unAuthHandler;
      }
    } else {
      yield next;
    }
  }
}

// {
//   swagger  : String, // location of docs
//   route    : String // route to return the docs for
//   restrict : {
//     accept : Array // array of options 'header, 'body', 'query'
//     key    : {
//       name  : String,
//       value : String
//     }
//   } || false
// }
