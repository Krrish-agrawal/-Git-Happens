const User = require('../models/User');

// Update user's theme preference
const updateThemePreference = async (req, res) => {
  try {
    const { themePreference } = req.body;

    // Validate theme preference
    if (!['light', 'dark'].includes(themePreference)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid theme preference. Must be either "light" or "dark"'
      });
    }

    // Update user's theme preference
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { themePreference },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        themePreference: updatedUser.themePreference
      }
    });

  } catch (error) {
    console.error('Error updating theme preference:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating theme preference',
      error: error.message
    });
  }
};

module.exports = {
  updateThemePreference
}; 