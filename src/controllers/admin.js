const Router = require('koa-router');
const router = new Router();

router.prefix('/admin');

router.get('/', async (ctx) => {
  ctx.body = '~lol 2cats~';
});

module.exports = router.routes();
