const jwtMiddleware = require('koa-jwt');
const { secret } = require('../lib/config');

module.exports = jwtMiddleware({
  secret,
});
