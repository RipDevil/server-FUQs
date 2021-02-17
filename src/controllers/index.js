const Router = require('koa-router');

const router = new Router();
const fuqs = require('./fuqs');
const users = require('./users');

// default response
router.get('/', (ctx) => {
  ctx.body = 'ok';
});

router.use(fuqs);
router.use(users);

module.exports = router;
