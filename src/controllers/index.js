const Router = require('koa-router');

const router = new Router();
const fuqs = require('./fuqs');

// default response
router.get('/', ctx => {
  ctx.body = 'ok';
});

router.use(fuqs);

module.exports = router;