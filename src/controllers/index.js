const Router = require('koa-router');

const router = new Router();
const fuqs = require('./fuqs');

router.use(fuqs);

module.exports = router;