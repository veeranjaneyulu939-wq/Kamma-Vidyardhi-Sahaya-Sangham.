const express = require('express');
const cors = require('cors');
const db = require('./database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-kamma-hostel-key';

app.use(cors());
app.use(express.json());

let dataDir = process.env.DATA_DIR || __dirname;
let uploadsDir = path.join(dataDir, 'uploads');
try {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
} catch (error) {
    console.error("Could not write to DATA_DIR, falling back to local directory.");
    dataDir = __dirname;
    uploadsDir = path.join(dataDir, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
}

app.use('/uploads', express.static(uploadsDir));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../dist')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token.' });
        req.user = user;
        next();
    });
};

// Admin Login Route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required.' });
    }
    
    db.get("SELECT * FROM admin_users WHERE username = ?", [username], (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        
        bcrypt.compare(password, user.password, (err, match) => {
            if (err || !match) {
                return res.status(401).json({ error: 'Invalid credentials.' });
            }
            
            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
            res.json({ success: true, token });
        });
    });
});

// Basic test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// API route to submit an admission form
app.post('/api/admissions', (req, res) => {
    const { studentName, dob, fatherName, contactNumber, course, address, email } = req.body;
    
    if (!studentName || !dob || !fatherName || !contactNumber || !course || !address || !email) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const sql = 'INSERT INTO admissions (studentName, dob, fatherName, contactNumber, course, address, email, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const status = 'Pending';
    db.run(sql, [studentName, dob, fatherName, contactNumber, course, address, email, status], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Failed to submit admission.' });
        }
        res.status(201).json({ success: true, admissionId: this.lastID });
    });
});

// API route to get all admissions (for admin - PROTECTED)
app.get('/api/admissions', authenticateToken, (req, res) => {
    const sql = 'SELECT * FROM admissions ORDER BY created_at DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve admissions.' });
        }
        res.json(rows);
    });
});

// Update admission status (Protected)
app.put('/api/admissions/:id/status', authenticateToken, (req, res) => {
    const { status } = req.body;
    const sql = 'UPDATE admissions SET status = ? WHERE id = ?';
    db.run(sql, [status, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: 'Failed to update status.' });
        res.json({ success: true });
    });
});

// Delete admission (Protected)
app.delete('/api/admissions/:id', authenticateToken, (req, res) => {
    db.run('DELETE FROM admissions WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: 'Failed to delete admission.' });
        res.json({ success: true });
    });
});

// Students Routes (Protected)
// Public students route
app.get('/api/public/students', (req, res) => {
    db.all('SELECT id, name, course, academicYear, branch, yearOfStudy, college FROM students ORDER BY academicYear DESC, name ASC', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/students', authenticateToken, (req, res) => {
    db.all('SELECT * FROM students ORDER BY academicYear DESC, name ASC', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/students', authenticateToken, (req, res) => {
    const { name, course, contactNumber, academicYear, branch, yearOfStudy, college } = req.body;
    if (!name || !course || !academicYear) return res.status(400).json({ error: 'Missing fields' });
    const sql = 'INSERT INTO students (name, course, contactNumber, academicYear, branch, yearOfStudy, college) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, [name, course, contactNumber || '', academicYear, branch || '', yearOfStudy || '', college || ''], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

app.delete('/api/students/:id', authenticateToken, (req, res) => {
    db.run('DELETE FROM students WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: 'Failed to delete student.' });
        res.json({ success: true });
    });
});

// API route to submit a contact message
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const sql = 'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)';
    db.run(sql, [name, email, message], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Failed to save message.' });
        }
        res.status(201).json({ success: true, messageId: this.lastID });
    });
});

// API route to get all messages (for admin - PROTECTED)
app.get('/api/messages', authenticateToken, (req, res) => {
    const sql = 'SELECT * FROM messages ORDER BY created_at DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve messages.' });
        }
        res.json(rows);
    });
});

// --- EVENTS API ---

// Get all events (Public)
app.get('/api/events', (req, res) => {
    const sql = 'SELECT * FROM events ORDER BY id DESC';
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Failed to retrieve events.' });
        res.json(rows);
    });
});

// Add a new event (Protected)
app.post('/api/events', authenticateToken, (req, res) => {
    const { title, date, location, description, image } = req.body;
    if (!title || !date || !location || !description) {
        return res.status(400).json({ error: 'All fields except image are required.' });
    }
    const sql = 'INSERT INTO events (title, date, location, description, image) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [title, date, location, description, image || null], function(err) {
        if (err) return res.status(500).json({ error: 'Failed to save event.' });
        res.status(201).json({ success: true, eventId: this.lastID });
    });
});

// Update an event (Protected)
app.put('/api/events/:id', authenticateToken, (req, res) => {
    const { title, date, location, description, image } = req.body;
    const sql = 'UPDATE events SET title = ?, date = ?, location = ?, description = ?, image = ? WHERE id = ?';
    db.run(sql, [title, date, location, description, image || null, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: 'Failed to update event.' });
        res.json({ success: true });
    });
});

// Delete an event (Protected)
app.delete('/api/events/:id', authenticateToken, (req, res) => {
    const sql = 'DELETE FROM events WHERE id = ?';
    db.run(sql, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: 'Failed to delete event.' });
        res.json({ success: true });
    });
});

// --- PAGES CMS API ---

// Get content for a specific page (Public)
app.get('/api/pages/:page_name', (req, res) => {
    const sql = 'SELECT content FROM pages WHERE page_name = ?';
    db.get(sql, [req.params.page_name], (err, row) => {
        if (err) return res.status(500).json({ error: 'Failed to retrieve page content.' });
        if (!row) return res.status(404).json({ error: 'Page not found.' });
        res.json(JSON.parse(row.content));
    });
});

// Update content for a specific page (Protected)
app.put('/api/pages/:page_name', authenticateToken, (req, res) => {
    const content = JSON.stringify(req.body);
    const sql = 'UPDATE pages SET content = ? WHERE page_name = ?';
    db.run(sql, [content, req.params.page_name], function(err) {
        if (err) return res.status(500).json({ error: 'Failed to update page content.' });
        if (this.changes === 0) {
            db.run('INSERT INTO pages (page_name, content) VALUES (?, ?)', [req.params.page_name, content], (err) => {
                if (err) return res.status(500).json({ error: 'Failed to create page content.' });
                return res.json({ success: true });
            });
        } else {
            res.json({ success: true });
        }
    });
});

// Image Upload Endpoint (Protected)
app.post('/api/upload', authenticateToken, upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    const fullUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ success: true, url: fullUrl });
});

// Catch-all route to serve the React app for any other request
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
