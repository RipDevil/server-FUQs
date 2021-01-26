const cors = require('./cors');
const bodyParser = require('./bodyParser');
const auth = require('./auth');
const errors = require('./errors');
const catchMongooseErrors = require('./mongoose-errors');
const custom = require('./custom');

module.exports = [cors, bodyParser, /*auth,*/ errors, catchMongooseErrors, custom];
