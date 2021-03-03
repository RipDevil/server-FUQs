const jwtMiddleware = require('koa-jwt');
const config = require('../lib/config');

module.exports = async (ctx, next) => {
  if (ctx.url.match(/\/admin*/)) {
    await jwtMiddleware({
      secret: config.secret
    })(ctx, next);
  } else {
    await next();
  }
};
