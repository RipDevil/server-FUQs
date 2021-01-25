require('dotenv').config();
const Koa = require('koa');
const cors = require('@koa/cors');

const { port, mode } = require('./lib/config');
const showBanner = require('node-banner');

const mongooseConfig = require('./lib/mongoose-config');
const handlers = require('./handlers');
const controllers = require('./controllers');

function createApp() {
  const app = new Koa();

  app.use(cors());
  handlers.forEach((h) => app.use(h));
  app.use(controllers.routes());
  app.use(controllers.allowedMethods());

  mongooseConfig();

  return app;
}

if (!module.parent) {
  createApp().listen(port, () =>
    console.log(
      mode === 'development'
        ? `---------> Started on port ${port}`
        : showBanner('The FUQs', `The server was started on ${port}`, 'red')
    )
  );
}

module.exports = createApp;
