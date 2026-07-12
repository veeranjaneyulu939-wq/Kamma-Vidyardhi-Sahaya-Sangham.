const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
const pages = [
  {
    name: 'past-presidents',
    content: JSON.stringify({
      title: 'Past Presidents & Secretaries',
      subtitle: 'Honoring those who led us through the years.',
      profiles: [{ name: 'Dr. Example President', role: 'President (1990-2000)', bio: 'Led the organization through significant growth and established many core programs.', image: 'https://via.placeholder.com/150' }]
    })
  },
  {
    name: 'founders',
    content: JSON.stringify({
      title: 'Founders',
      subtitle: 'The visionary leaders who started it all.',
      profiles: [{ name: 'Sri Founder Name', role: 'Founder Member', bio: 'A visionary leader who laid the foundation stone for the organization.', image: 'https://via.placeholder.com/150' }]
    })
  },
  {
    name: 'governing-body',
    content: JSON.stringify({
      title: 'Governing Body',
      subtitle: 'The current leadership guiding our institution.',
      profiles: [{ name: 'Current President', role: 'President', bio: 'Guiding the organization towards a brighter future.', image: 'https://via.placeholder.com/150' }]
    })
  }
];

pages.forEach(p => {
  db.run('UPDATE pages SET content = ? WHERE page_name = ?', [p.content, p.name], function(err) {
    if (this.changes === 0) {
      db.run('INSERT INTO pages (page_name, content) VALUES (?, ?)', [p.name, p.content]);
    }
  });
});

setTimeout(() => {
  console.log('Database updated successfully.');
  process.exit(0);
}, 1000);
