'use strict';

module.exports.frameworks = {};
module.exports.frameworks.base = require('./frameworks/base');
// module.exports.frameworks.express = require('./frameworks/express');
// module.exports.frameworks.koa = require('./frameworks/koa');
// module.exports.frameworks.koa2 = require('./frameworks/koa2');

let build = (framework) => (config={}) => {
  let driver = new module.exports.frameworks[framework](config);
  return driver.middleware();
}

module.exports.express = build('express');
module.exports.koa = build('koa');
module.exports.koa.next = build('koa2');
