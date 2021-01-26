const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const privatePaths = require('mongoose-private-paths');

const userSchema = new Schema({
  login: {
    type: String,
    required: true,
    unique: true
  },
  _crdate: {
    type: Date,
    default: Date.now
  },
  fuqs: {
    type: Array,
    default: []
  },
  password: {
    type: String,
    required: true
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

userSchema.plugin(privatePaths);

module.exports = mongoose.model('users', userSchema);