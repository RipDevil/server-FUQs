const mongoose = require('mongoose');
const { mongoUri } = require('./config');

// TODO: Here we can mock with `mongodb-memory-server`

module.exports = () => {
  mongoose
    .connect(mongoUri, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }) // not using useNewUrlParser is deprecated
    .then(() => console.log('Mongoose database has been connected'))
    .catch((e) => console.error(e));
};
