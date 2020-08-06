  
const bodyParser = require('./bodyParser');
const errors = require('./errors');
const catchMongooseErrors = require('./mongoose-errors')
const custom = require('./custom');

module.exports = [
    bodyParser,
    errors,
    catchMongooseErrors,
    custom
];