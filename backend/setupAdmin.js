require('dotenv').config();
const { db } = require('./config/firebase');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
  try {
    const email = 'kammahostel1930@gnt.com';
    const password = 'kamma1930';
    const username = 'kammahostel1930';

    const usersRef = db.collection('users');
    
    // Check if exists
    const snapshot = await usersRef.where('email', '==', email).get();
    if (!snapshot.empty) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await usersRef.add({
      username,
      email,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString()
    });

    console.log('Admin account created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
};

createAdmin();
