const mongoose = require('mongoose');

const StandupSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  workspaceId: String,
  today: String,
  blockers: String,
  date: { type: String, default: () => new Date().toLocaleDateString() }
}, { timestamps: true });

module.exports = mongoose.model('Standup', StandupSchema);