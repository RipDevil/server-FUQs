  
const bodyParser = require('./bodyParser');
const errors = require('./errors');
const custom = require('./custom');

module.exports = [
    bodyParser,
    errors,
    custom
];