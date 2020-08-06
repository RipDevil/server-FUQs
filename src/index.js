require('dotenv').config()
const { port } = require('./lib/config');

const showBanner = require('node-banner');
const Koa = require('koa');
const app = new Koa();

const handlers = require('./handlers');
const controllers = require('./controllers');

handlers.forEach(h => app.use(h))
app.use(controllers.routes());
app.use(controllers.allowedMethods());

app.listen(port, () => console.log(showBanner('The FUQs', `The server was started on ${port}`, 'red')));