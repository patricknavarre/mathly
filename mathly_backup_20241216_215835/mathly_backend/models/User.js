const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  grade: {
    type: Number,
    required: true,
    min: 3,
    max: 8,
  },
  level: {
    type: Number,
    default: 1,
  },
  xp: {
    type: Number,
    default: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastPlayed: {
    type: Date,
    default: Date.now,
  },
  achievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement',
  }],
  gameHistory: [{
    gameType: String,
    score: Number,
    date: {
      type: Date,
      default: Date.now,
    },
  }],
  character: {
    type: String,
    default: 'Unicorn', // Default character
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema); 