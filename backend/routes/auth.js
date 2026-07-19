const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');
const auth = require('../middleware/auth');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to create JWT
const signToken = (user, res) => {
  const payload = {
    user: {
      id: user.id,
      role: user.role
    }
  };
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
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
    const usersRef = db.collection('users');
    // Allow login by email or username
    const snapshot = await usersRef.where('username', '==', username).get();
    let userDoc = snapshot.empty ? null : snapshot.docs[0];
    
    if (!userDoc) {
      const emailSnapshot = await usersRef.where('email', '==', username).get();
      userDoc = emailSnapshot.empty ? null : emailSnapshot.docs[0];
    }

    if (!userDoc) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const userData = userDoc.data();
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    signToken({ id: userDoc.id, role: userData.role }, res);
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
    
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    
    let userId;
    let userRole = 'warden';

    if (snapshot.empty) {
      const newUser = await usersRef.add({
        username: name,
        email,
        googleId: sub,
        role: 'warden',
        createdAt: new Date().toISOString()
      });
      userId = newUser.id;
    } else {
      userId = snapshot.docs[0].id;
      userRole = snapshot.docs[0].data().role;
    }
    
    signToken({ id: userId, role: userRole }, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Google Authentication failed' });
  }
});

module.exports = router;
