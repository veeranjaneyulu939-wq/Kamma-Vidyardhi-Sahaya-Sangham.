const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dataDir = process.env.DATA_DIR || __dirname;
const dbPath = path.resolve(dataDir, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS pages (
        page_name TEXT PRIMARY KEY,
        content TEXT NOT NULL
    )`, (err) => {
        if (!err) {
            const initialPages = [
                {
                    name: 'home',
                    content: JSON.stringify({
                        welcomeTitle: 'Welcome to Kamma Vidyarthi Sahaya Sangam',
                        welcomeSubtitle: 'Providing a premium, nurturing environment for students since 1910.',
                        aboutTitle: 'About KVSS',
                        aboutText: 'Kamma Vidyarthi Sahaya Sangam (KVSS) has been a beacon of hope and support for students for over a century. Our mission is to provide an environment where students can focus entirely on their academic and personal growth, without worrying about basic necessities. We believe in holistic development, fostering not just academic excellence but also moral values and social responsibility.'
                    })
                },
                {
                    name: 'history',
                    content: JSON.stringify({
                        title: 'Our Glorious History',
                        subtitle: 'Over a Century of Service to Students',
                        timeline: [
                            { year: '1910', event: 'The inception of Kamma Vidyarthi Sahaya Sangam with a vision to support students in need.' },
                            { year: '1945', event: 'Expanded facilities to accommodate more students and introduced new academic support programs.' },
                            { year: '1980', event: 'Modernized the hostel infrastructure, adding better amenities for a comfortable stay.' },
                            { year: '2010', event: 'Celebrated the Centenary year, marking 100 years of unwavering commitment to student welfare.' },
                            { year: '2023', event: 'Completed major renovations and introduced digital learning resources in the library.' }
                        ]
                    })
                },
                {
                    name: 'hostel',
                    content: JSON.stringify({
                        title: 'Boys Hostel Facilities',
                        subtitle: 'A Home Away From Home',
                        facilitiesText: 'Our boys hostel provides a safe, comfortable, and conducive environment for academic pursuits. We understand that a peaceful living space is crucial for student success.',
                        features: [
                            { title: 'Spacious Rooms', desc: 'Well-ventilated and naturally lit rooms designed for comfortable living and studying.' },
                            { title: 'Nutritious Food', desc: 'Hygienic and balanced meals prepared in our modern kitchen facility.' },
                            { title: '24/7 Security', desc: 'Round-the-clock security personnel and CCTV surveillance for complete safety.' },
                            { title: 'Library & Reading Room', desc: 'Quiet spaces equipped with essential reference books and daily newspapers.' },
                            { title: 'Recreation', desc: 'Indoor games and a TV room for relaxation during leisure time.' },
                            { title: 'Medical Assistance', desc: 'Tie-ups with local hospitals for immediate medical attention when needed.' }
                        ]
                    })
                },
                {
                    name: 'donate',
                    content: JSON.stringify({
                        title: 'Support Our Cause',
                        subtitle: 'Your contribution helps us shape the future',
                        intro: 'Kamma Vidyarthi Sahaya Sangam runs primarily on the generous donations of philanthropists and alumni. Your contribution directly impacts the lives of deserving students by providing them with food, shelter, and educational support.',
                        bankDetails: {
                            name: 'KVSS Trust Account',
                            accountNumber: '12345678901234',
                            ifsc: 'SBIN0001234',
                            branch: 'Governorpet Branch, Vijayawada'
                        }
                    })
                },
                {
                    name: 'gallery',
                    content: JSON.stringify({
                        title: 'Photo Gallery',
                        subtitle: 'Glimpses of our hostels, events, and activities.',
                        images: [
                            "https://via.placeholder.com/400x300?text=Hostel+Building",
                            "https://via.placeholder.com/400x300?text=Dining+Hall",
                            "https://via.placeholder.com/400x300?text=Library",
                            "https://via.placeholder.com/400x300?text=Sports+Event",
                            "https://via.placeholder.com/400x300?text=Annual+Day",
                            "https://via.placeholder.com/400x300?text=Student+Room"
                        ]
                    })
                },
                {
                    name: 'contact',
                    content: JSON.stringify({
                        title: 'Contact Us',
                        subtitle: 'Get in touch with us for any inquiries, admissions, or donations.',
                        address: 'D.No. 27-12-75, Gandikota Complex, Prakasam Road, Governorpet, Vijayawada - 520 002.',
                        phone: '2577606',
                        email: 'kvssvja1910@gmail.com',
                        formTitle: 'Send us a Message'
                    })
                },
                {
                    name: 'past-presidents',
                    content: JSON.stringify({
                        title: 'Past Presidents & Secretaries',
                        subtitle: 'Honoring those who led us through the years.',
                        profiles: [
                            { name: 'Dr. Example President', role: 'President (1990-2000)', bio: 'Led the organization through significant growth and established many core programs.', image: 'https://via.placeholder.com/150' }
                        ]
                    })
                },
                {
                    name: 'founders',
                    content: JSON.stringify({
                        title: 'Founders',
                        subtitle: 'The visionary leaders who started it all.',
                        profiles: [
                            { name: 'Sri Founder Name', role: 'Founder Member', bio: 'A visionary leader who laid the foundation stone for the organization.', image: 'https://via.placeholder.com/150' }
                        ]
                    })
                },
                {
                    name: 'governing-body',
                    content: JSON.stringify({
                        title: 'Governing Body',
                        subtitle: 'The current leadership guiding our institution.',
                        profiles: [
                            { name: 'Current President', role: 'President', bio: 'Guiding the organization towards a brighter future.', image: 'https://via.placeholder.com/150' }
                        ]
                    })
                }
            ];

            initialPages.forEach(page => {
                db.get("SELECT page_name FROM pages WHERE page_name = ?", [page.name], (err, row) => {
                    if (!row) {
                        db.run("INSERT INTO pages (page_name, content) VALUES (?, ?)", [page.name, page.content]);
                    }
                });
            });
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`, (err) => {
        if (!err) {
            db.get("SELECT * FROM admin_users WHERE username = 'admin'", (err, row) => {
                if (!row) {
                    bcrypt.hash("admin123", 10, (err, hash) => {
                        if (!err) {
                            db.run("INSERT INTO admin_users (username, password) VALUES (?, ?)", ['admin', hash]);
                            console.log("Default admin account created.");
                        }
                    });
                }
            });
        }
    });
  }
});

module.exports = db;
