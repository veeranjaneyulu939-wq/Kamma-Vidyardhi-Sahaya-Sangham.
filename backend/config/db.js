const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let dbInstance = null;

const initDB = async () => {
  if (dbInstance) return dbInstance;
  
  const dbPath = path.join(__dirname, '..', 'database.sqlite');
  
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT,
      googleId TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hostelId TEXT UNIQUE,
      studentName TEXT,
      college TEXT,
      year INTEGER,
      courseType TEXT,
      branch TEXT,
      roomNo TEXT,
      phoneNumber TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      studentId INTEGER,
      status TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(studentId) REFERENCES students(id),
      UNIQUE(date, studentId)
    );

    CREATE TABLE IF NOT EXISTS gallery_photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      imageUrl TEXT,
      uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  dbInstance = db;
  console.log('SQLite Database initialized successfully.');
  return db;
};

// Immediately initialize
initDB().catch(err => console.error('DB init failed', err));

module.exports = { initDB };
