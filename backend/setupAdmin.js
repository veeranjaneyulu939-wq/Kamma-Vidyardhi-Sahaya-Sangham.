const { initDB } = require('./config/db');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
  try {
    const db = await initDB();
    const email = 'kammahostel1930@gnt.com';
    const password = 'kamma1930';
    const username = 'kammahostel1930';

    const existing = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existing) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'admin']
    );

    console.log('Admin account created successfully in local database!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
};

createAdmin();
