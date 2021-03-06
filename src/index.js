require('dotenv').config();
const Koa = require('koa');
const koaHelmet = require('koa-helmet');

const showBanner = require('./hepers/showBanner');
const { port } = require('./lib/config');
const mongooseConfig = require('./lib/mongoose-config');

const handlers = require('./handlers');
const controllers = require('./controllers');

function createApp() {
  const app = new Koa();

  app.use(koaHelmet());

  handlers.forEach((h) => app.use(h));

  app.use(controllers.routes());
  app.use(controllers.allowedMethods());

  return app;
}

if (!module.parent) {
  mongooseConfig()
  createApp().listen(port, showBanner);
}

module.exports = createApp;
