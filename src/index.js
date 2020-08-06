require('dotenv').config()
const Koa = require('koa');

const { port, mode } = require('./lib/config');
const showBanner = require('node-banner');

const mongooseConfig = require('./lib/mongoose-config');
const handlers = require('./handlers');
const controllers = require('./controllers');

const app = new Koa();

handlers.forEach(h => app.use(h))
app.use(controllers.routes());
app.use(controllers.allowedMethods());

mongooseConfig();

app.listen(port, () => console.log(mode === "development" ? `---------> Started on port ${port}` : showBanner('The FUQs', `The server was started on ${port}`, 'red')));