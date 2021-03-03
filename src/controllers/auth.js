const Router = require('koa-router');
const jwtMiddleware = require('koa-jwt');
const { compareSync } = require('bcryptjs');
const router = new Router();

const User = require('../models/user');
const RefreshToken = require('../models/token');
const issueTokenPair = require('../hepers/issueToken');
const config = require('../lib/config');

router.prefix('/auth');

router.post('/login', async (ctx) => {
  const { login, password } = ctx.request.body;
  const user = await User.findOne({ login });

  if (!user || !compareSync(password, user.password)) {
    ctx.throw(403);
  }

  ctx.body = await issueTokenPair(user._id);
});

router.post('/refresh', async (ctx) => {
  const { refreshToken } = ctx.request.body;
  const dbToken = await RefreshToken.findOne({ token: refreshToken });

  if (!dbToken) {
    return;
  }

  await RefreshToken.deleteOne({ token: refreshToken });

  ctx.body = await issueTokenPair(dbToken.userId);
});

router.post('/logout', jwtMiddleware({ secret: config.secret }), async (ctx) => {
  const { id: userId } = ctx.state.user;
  await RefreshToken.deleteMany({ userId });

  ctx.status = 204;
  ctx.body = 'Success';
});

module.exports = router.routes();
