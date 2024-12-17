const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Add this route at the top of your existing routes
router.get('/test', (req, res) => {
  res.json({ message: 'User routes are working!' });
});

// Register user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, grade } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
      grade,
      level: 1,
      xp: 0,
      streak: 0,
      lastPlayed: new Date(),
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        grade: user.grade,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        grade: user.grade,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user grade
router.put('/grade', auth, async (req, res) => {
  try {
    const { grade } = req.body;
    const user = await User.findById(req.user.userId);
    user.grade = grade;
    await user.save();
    res.json({ grade: user.grade });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
