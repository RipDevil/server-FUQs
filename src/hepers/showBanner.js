const showBanner = require('node-banner');
const { port, mode } = require('../lib/config');

module.exports = () => {
  const isDevelopment = mode === 'development';
  console.log(
    isDevelopment
      ? `---------> Started on port ${port}`
      : showBanner('The FUQs', `The server was started on ${port}`, 'red')
  );
};
