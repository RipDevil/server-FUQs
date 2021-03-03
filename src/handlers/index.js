const cors = require('./cors');
const auth = require('./auth');
const bodyParser = require('./bodyParser');
const errors = require('./errors');
const catchMongooseErrors = require('./mongoose-errors');
const custom = require('./custom');

module.exports = [cors, bodyParser, auth, errors, catchMongooseErrors, custom];
