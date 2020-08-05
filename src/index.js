require('dotenv').config()

const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// response
app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(process.env.PORT)