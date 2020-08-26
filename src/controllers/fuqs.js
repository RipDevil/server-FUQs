const Router = require('koa-router');
const router = new Router();

const Fuq = require('../models/fuq');
router.prefix('/fuq');

// Get a one fuq
router.get('/', async (ctx) => {
  const fuqs = await Fuq.aggregate([{ $sample: { size: 1 } }]);
  ctx.status = 200;
  ctx.body = fuqs[0];
});

// Post a one fuq
router.put('/', async (ctx) => {
  const { title, text } = ctx.request.body;

  const fuq = await Fuq.findOne({ title, text });
  if (fuq) {
    ctx.throw(400, 'This FUQ is already exists');
  }

  const newFuq = await new Fuq({ title, text }).save();
  ctx.status = 201;
  ctx.body = newFuq;
});

// Change a one fuq
router.post('/:id', async (ctx) => {
  const { id } = ctx.params;

  const fuq = await Fuq.findById(id);
  if (fuq) {
    const { title, text } = ctx.request.body;
    await Fuq.updateOne({ _id: id }, { title, text });
    ctx.status = 201;
  } else {
    ctx.throw(404, 'FUQ has not been found');
  }
});

// Delete a one fuq
router.delete('/:id', async (ctx) => {
  const { id } = ctx.params;
  await Fuq.deleteOne({ _id: id });
  ctx.status = 202;
});

module.exports = router.routes();
