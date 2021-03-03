const Router = require('koa-router');
const router = new Router();

const auth = require('./auth');
const fuqs = require('./fuqs');
const users = require('./users');
const admin = require('./admin');

// default response
router.get('/', (ctx) => {
  ctx.body = 'ok';
});

router.use(auth);
router.use(admin);
router.use(fuqs);
router.use(users);

module.exports = router;
