const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy');

const signToken = (payload, res) => {
  const secret = process.env.JWT_SECRET || 'secret';
  jwt.sign(payload, secret, { expiresIn: '24h' }, (err, token) => {
    if (err) throw err;
    res.json({ token, role: payload.role });
  });
};

// @route   POST api/auth/login
router.post('/login', async (req, res) => {
  const username = (req.body.username || '').trim();
  const password = req.body.password;
  
  try {
    const user = await User.findOne({ $or: [{ username }, { email: username }] });
    
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials - User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials - Password incorrect' });
    }

    signToken({ id: user._id, role: user.role }, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/register
// @desc    Register a new admin
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    await user.save();
    res.json({ msg: 'Admin registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/auth/admins
// @desc    Get all admins
router.get('/admins', async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');
    res.json(admins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create default admin on boot if none exists
const createDefaultAdmin = async () => {
  try {
    const adminCount = await User.countDocuments();
    if (adminCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('kamma1930', salt);
      const admin = new User({
        username: 'admin',
        email: 'kammahostel1930@gnt.com',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('Default admin created in MongoDB.');
    }
  } catch (err) {
    console.error('Failed to create default admin', err);
  }
};
createDefaultAdmin();

module.exports = router;
