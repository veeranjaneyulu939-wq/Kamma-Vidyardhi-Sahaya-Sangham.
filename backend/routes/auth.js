const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { initDB } = require('../config/db');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy');

const signToken = (user, res) => {
  const payload = { user: { id: user.id, role: user.role } };
  jwt.sign(
    payload,
    process.env.JWT_SECRET || 'secret',
    { expiresIn: 360000 },
    (err, token) => {
      if (err) throw err;
      res.json({ token, role: user.role });
    }
  );
};

// @route   POST api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const db = await initDB();
    const user = await db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
    
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    signToken({ id: user.id, role: user.role }, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/register
// @desc    Register a new admin (only accessible by existing admins, or open for now)
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const db = await initDB();
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'admin']
    );

    res.json({ msg: 'Admin created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/auth/admins
// @desc    Get list of all admin users
router.get('/admins', async (req, res) => {
  try {
    const db = await initDB();
    const admins = await db.all('SELECT id, username, email, role, createdAt FROM users WHERE role = ?', ['admin']);
    res.json(admins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/google
router.post('/google', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, sub } = ticket.getPayload();
    
    const db = await initDB();
    let user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!user) {
      const result = await db.run(
        'INSERT INTO users (username, email, googleId, role) VALUES (?, ?, ?, ?)',
        [name, email, sub, 'warden']
      );
      user = { id: result.lastID, role: 'warden' };
    }
    
    signToken({ id: user.id, role: user.role }, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Google Authentication failed' });
  }
});

module.exports = router;
