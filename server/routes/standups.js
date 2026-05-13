const express = require('express');
const Standup = require('../models/Standup');
const auth = require('../middleware/auth');
const router = express.Router();

// Get today's standups for workspace
router.get('/:workspaceId', auth, async (req, res) => {
  try {
    const today = new Date().toLocaleDateString();
    const standups = await Standup.find({
      workspaceId: req.params.workspaceId,
      date: today
    }).sort({ createdAt: -1 });
    res.json(standups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Post standup
router.post('/', auth, async (req, res) => {
  try {
    const { today, blockers, workspaceId } = req.body;
    const standup = new Standup({
      userId: req.user.id,
      userName: req.user.name,
      workspaceId,
      today,
      blockers
    });
    await standup.save();
    res.json(standup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;