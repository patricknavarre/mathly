const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user progress stats
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('level xp streak gameHistory achievements');
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user achievements
router.get('/achievements', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('achievements')
      .select('achievements');
    
    res.json(user.achievements);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user game history
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('gameHistory')
      .sort({ 'gameHistory.date': -1 })
      .limit(10);
    
    res.json(user.gameHistory);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 