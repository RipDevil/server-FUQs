const Router = require('koa-router');
const router = new Router();
const { hashSync } = require('bcryptjs');

const User = require('../models/user');
router.prefix('/users');

router.get('/', async (ctx) => {
  const users = await User.find({ deleted: false });

  ctx.status = 200;
  ctx.body = users;
});

router.get('/:id', async (ctx) => {
  const { id } = ctx.params;
  const user = await User.findOne({ _id: id, deleted: false });

  if (user) {
    ctx.status = 200;
    ctx.body = user;
  } else {
    ctx.throw(404, 'No such user');
  }
});

router.put('/', async (ctx) => {
  if (!ctx.request.body.login || !ctx.request.body.password) {
    ctx.throw(400);
  } else {
    const { login, password } = ctx.request.body;
    const user = await User.findOne({ login });

    if (user) {
      ctx.throw(406, 'This user already exists');
    }

    const newUser = await new User({ login, password: hashSync(password) }).save();

    ctx.status = 201;
    ctx.body = newUser;
  }
});

router.delete('/:id', async (ctx) => {
  const { id } = ctx.params;
  await User.deleteOne({ _id: id });
  ctx.status = 202;
});

module.exports = router.routes();