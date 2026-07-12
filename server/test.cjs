const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
db.get("SELECT content FROM pages WHERE page_name = 'home'", (err, row) => {
  console.log(row.content);
  process.exit(0);
});
