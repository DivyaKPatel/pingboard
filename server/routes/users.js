const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all users in workspace
router.get('/workspace/:workspaceId', auth, async (req, res) => {
  try {
    const users = await User.find(
      { workspaceId: req.params.workspaceId },
      '-password'
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update status
router.put('/status', auth, async (req, res) => {
  try {
    const { status, statusText } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { status, statusText, lastSeen: Date.now() },
      { new: true, select: '-password' }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;