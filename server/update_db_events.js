const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    console.log("Adding image column to events table...");
    db.run(`ALTER TABLE events ADD COLUMN image TEXT;`, function(err) {
        if (err) {
            console.error("Error altering table, it might already have the column:", err.message);
        } else {
            console.log("Successfully added image column to events table.");
        }
    });
});

db.close();
