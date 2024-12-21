const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // ... existing fields ...
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password']
  },
  themePreference: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema); 