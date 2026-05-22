const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  workspaceId: { type: String, default: 'general' },
  status: {
    type: String,
    enum: ['online', 'meeting', 'busy', 'offline'],
    default: 'offline'
  },
  statusText: { type: String, default: '' },
  lastSeen: { type: Date, default: Date.now }
}, { timestamps: true });
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);