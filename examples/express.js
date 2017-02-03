'use strict';

let express = require('express');
let cookieParser = require('cookie-parser');
let swagger = require('../');

let app = express();

const PORT = process.env.NODE_ENV || 3000;

app.use(cookieParser());
app.use(swagger.express({
  // debug: true,
  // prefix: '/v1',
  css: '.info_title {font-size: 50px !important; }',
  path: `${__dirname}/swagger.json`,
  // authentication: {
  //   sources: ['query'],
  //   key: 'foo',
  //   value: 'bar'
  // },
  // unauthorized: (req, res) => {
  //   res.status(401).send({ error: 'Not authorized' });
  // }
}));

app.use((req, res, next) => {
  res.send({ status: 'OK' });
});

app.listen(PORT);
console.log(`Listening on port ${PORT}`);
