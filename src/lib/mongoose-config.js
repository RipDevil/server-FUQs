const mongoose = require('mongoose');
const { mongoUri } = require('./config');

module.exports = () => {
  mongoose
    .connect(mongoUri, { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true }) // not using useNewUrlParser is deprecated
    .then(() => console.log('Mongoose database has been connected'))
    .catch(e => console.error(e));
};