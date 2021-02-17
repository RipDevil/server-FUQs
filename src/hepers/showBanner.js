const showBanner = require('node-banner');
const { port, mode } = require('../lib/config');

module.exports = () => {
  const isDevelopment = mode === 'development';

  // eslint-disable-next-line no-console
  console.log(
    isDevelopment
      ? `---------> Started on port ${port}`
      : showBanner('The FUQs', `The server was started on ${port}`, 'red'),
  );
};
