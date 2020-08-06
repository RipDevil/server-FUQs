const Router = require('koa-router');

const router = new Router();

// Get a one fuq
router.get('/', async (ctx) => {
  ctx.body = {
    sample: "Get a one fuq",
    ctx
  }
});

// Post a one fuq
router.put('/:id', async (ctx) => {
  ctx.body = {
    sample: "Post a one fuq",
    req: ctx.request.body,
    ctx
  }
});

// Change a one fuq
router.post('/:id', async (ctx) => {
  ctx.body = {
    sample: "Change a one fuq",
    req: ctx.request.body,
    ctx
  }
});

// Delete a one fuq
router.delete('/:id', async (ctx) => {
  ctx.body = {
    sample: "Delete a one fuq",
    req: ctx.request.body,
    ctx
  }
});


module.exports = router.routes();