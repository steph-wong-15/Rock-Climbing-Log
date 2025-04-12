const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  type: String, // "image" or "video"
  url: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const ClimbLogSchema = new mongoose.Schema({
  date: Date,
  location: String,
  difficulty: String,
  notes: String,
  media: [MediaSchema],
});

module.exports = mongoose.model('ClimbLog', ClimbLogSchema);
