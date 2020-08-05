const Router = require('koa-router');

const router = new Router();

router.get('/', async (ctx) => {
    console.log('ctx :>> ', ctx);
    console.log('ctx.request.body :>> ', ctx.request.body);
});

router.post('/', async (ctx) => {
    console.log('ctx :>> ', ctx);
});

module.exports = router.routes();