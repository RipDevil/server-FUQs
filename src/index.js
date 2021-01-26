require('dotenv').config();
const Koa = require('koa');

const showBanner = require('./hepers/showBanner');
const { port } = require('./lib/config');
const mongooseConfig = require('./lib/mongoose-config');

const handlers = require('./handlers');
const controllers = require('./controllers');

function createApp() {
  const app = new Koa();

  handlers.forEach((h) => app.use(h));

  app.use(controllers.routes());
  app.use(controllers.allowedMethods());

  mongooseConfig(); // connect to DB

  return app;
}

if (!module.parent) {
  createApp().listen(port, showBanner);
}

module.exports = createApp;
