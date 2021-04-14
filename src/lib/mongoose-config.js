const mongoose = require('mongoose');
const { mongoUri } = require('./config');

module.exports = () => {
  mongoose
    .connect(mongoUri, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }) // not using useNewUrlParser is deprecated
    // eslint-disable-next-line no-console
    .then(() => console.log('Mongoose database has been connected'))
    // eslint-disable-next-line no-console
    .catch((e) => console.error(e));
};
