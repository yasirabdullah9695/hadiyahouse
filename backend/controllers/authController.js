const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── JWT Token generate karo ────────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Token ko cookie mein bhi set karo
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 din
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  // Password response mein mat bhejo
  const userResponse = {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  res
    .status(statusCode)
    .cookie('hadiya_token', token, cookieOptions)
    .json({
      success: true,
      message,
      token,
      user: userResponse,
    });
};

// ─── POST /api/auth/login ───────────────────────────────────────────────────
/**
 * Admin login
 * Body: { email, password }
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email aur password dono chahiye',
      });
    }

    // User DB mein dhundo — password bhi select karo (default mein nahi aata)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ya password galat hai',
      });
    }

    // Password check karo
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ya password galat hai',
      });
    }

    sendTokenResponse(user, 200, res, 'Login successful!');
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/auth/me ───────────────────────────────────────────────────────
/**
 * Current logged-in user ka info return karo
 * Requires: protect middleware
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/auth/logout ──────────────────────────────────────────────────
/**
 * Logout — cookie clear karo
 */
const logout = (req, res) => {
  res
    .cookie('hadiya_token', 'none', {
      expires: new Date(Date.now() + 10 * 1000), // 10 seconds mein expire
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
      message: 'Successfully logout ho gaya',
    });
};

// ─── POST /api/auth/register ────────────────────────────────────────────────
/**
 * Naya user register karo (sirf admin kar sakta hai)
 * Body: { email, password, name, role }
 */
const register = async (req, res, next) => {
  try {
    const { email, password, name, role = 'user' } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email aur password dono chahiye',
      });
    }

    // Pehle se user hai kya?
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Is email se already account hai',
      });
    }

    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name,
      role,
    });

    sendTokenResponse(user, 201, res, 'User successfully bana diya!');
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/auth/change-password ─────────────────────────────────────────
/**
 * Password change karo (logged-in admin)
 * Body: { currentPassword, newPassword }
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current aur new password dono chahiye',
      });
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password galat hai',
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password successfully change ho gaya!');
  } catch (error) {
    next(error);
  }
};

module.exports = { login, getMe, logout, register, changePassword };
