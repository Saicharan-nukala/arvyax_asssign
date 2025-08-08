const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:    { type: String, required: true },
  tags:     [{ type: String }],
  jsonUrl:  { type: String },
  status:   { type: String, enum: ['draft', 'published'], default: 'draft' },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
