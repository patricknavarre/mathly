const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Submit game score
router.post('/submit-score', auth, async (req, res) => {
  try {
    const { gameType, score } = req.body;
    const user = await User.findById(req.user.userId);

    // Add game to history
    user.gameHistory.push({
      gameType,
      score,
    });

    // Calculate XP gained (example calculation)
    const xpGained = Math.floor(score / 10);
    user.xp += xpGained;

    // Check if level up is needed
    const newLevel = Math.floor(user.xp / 1000) + 1;
    if (newLevel > user.level) {
      user.level = newLevel;
    }

    // Update streak
    const lastPlayed = new Date(user.lastPlayed);
    const today = new Date();
    const diffDays = Math.floor((today - lastPlayed) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      user.streak += 1;
    } else if (diffDays > 1) {
      user.streak = 1;
    }
    
    user.lastPlayed = today;

    await user.save();

    res.json({
      xpGained,
      newLevel: user.level,
      totalXp: user.xp,
      streak: user.streak,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ level: -1, xp: -1 })
      .limit(10)
      .select('username level xp');
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 