'use strict';

module.exports.frameworks = {};
module.exports.frameworks.base = require('./frameworks/base');
// module.exports.frameworks.express = require('./frameworks/express');
module.exports.frameworks.koa = require('./frameworks/koa');

let build = (framework) => (config={}) => {
  let driver = new module.exports.frameworks[framework](config);
  return driver.middleware();
}

module.exports.express = build('express');
module.exports.koa = build('koa');
