const mongoose = require('mongoose');

const { Schema } = mongoose;
const privatePaths = require('mongoose-private-paths');

const fuqSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  crdate: {
    type: Date,
    default: Date.now,
  },
  text: {
    type: String,
    required: true,
    unique: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  influencer: {
    type: Number,
    default: 0,
  },
  _lastEditor: {
    type: String,
    default: 'Badmin',
  },
  _pending: {
    type: Boolean,
    default: false,
  },
});

fuqSchema.plugin(privatePaths);

module.exports = mongoose.model('fuqs', fuqSchema);
