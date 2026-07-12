const express = require('express');
const cors = require('cors');
const { AdminUser, Student, Admission, Message, Event, Page } = require('./database');
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
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required.' });
    }
    
    try {
        const user = await AdminUser.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, token });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Basic test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// API route to submit an admission form
app.post('/api/admissions', async (req, res) => {
    const { studentName, dob, fatherName, contactNumber, course, address, email } = req.body;
    
    if (!studentName || !dob || !fatherName || !contactNumber || !course || !address || !email) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const admission = new Admission({
            studentName, dob, fatherName, contactNumber, course, address, email, status: 'Pending'
        });
        await admission.save();
        res.status(201).json({ success: true, admissionId: admission._id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit admission.' });
    }
});

// API route to get all admissions (for admin - PROTECTED)
app.get('/api/admissions', authenticateToken, async (req, res) => {
    try {
        const admissions = await Admission.find().sort({ created_at: -1 });
        res.json(admissions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve admissions.' });
    }
});

// Update admission status (Protected)
app.put('/api/admissions/:id/status', authenticateToken, async (req, res) => {
    try {
        await Admission.findByIdAndUpdate(req.params.id, { status: req.body.status });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update status.' });
    }
});

// Delete admission (Protected)
app.delete('/api/admissions/:id', authenticateToken, async (req, res) => {
    try {
        await Admission.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete admission.' });
    }
});

// Students Routes (Protected)
// Public students route
app.get('/api/public/students', async (req, res) => {
    try {
        const students = await Student.find({}, 'name course academicYear branch yearOfStudy college').sort({ academicYear: -1, name: 1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/students', authenticateToken, async (req, res) => {
    try {
        const students = await Student.find().sort({ academicYear: -1, name: 1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/students', authenticateToken, async (req, res) => {
    const { name, course, contactNumber, academicYear, branch, yearOfStudy, college } = req.body;
    if (!name || !course || !academicYear) return res.status(400).json({ error: 'Missing fields' });
    
    try {
        const student = new Student({
            name, course, contactNumber: contactNumber || '', academicYear, branch: branch || '', yearOfStudy: yearOfStudy || '', college: college || ''
        });
        await student.save();
        res.json({ id: student._id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save student.' });
    }
});

app.delete('/api/students/:id', authenticateToken, async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete student.' });
    }
});

// API route to submit a contact message
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const msg = new Message({ name, email, message });
        await msg.save();
        res.status(201).json({ success: true, messageId: msg._id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save message.' });
    }
});

// API route to get all messages (for admin - PROTECTED)
app.get('/api/messages', authenticateToken, async (req, res) => {
    try {
        const messages = await Message.find().sort({ created_at: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve messages.' });
    }
});

// --- EVENTS API ---

// Get all events (Public)
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find().sort({ _id: -1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve events.' });
    }
});

// Add a new event (Protected)
app.post('/api/events', authenticateToken, async (req, res) => {
    const { title, date, location, description, image } = req.body;
    if (!title || !date || !location || !description) {
        return res.status(400).json({ error: 'All fields except image are required.' });
    }
    
    try {
        const event = new Event({ title, date, location, description, image: image || null });
        await event.save();
        res.status(201).json({ success: true, eventId: event._id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save event.' });
    }
});

// Update an event (Protected)
app.put('/api/events/:id', authenticateToken, async (req, res) => {
    const { title, date, location, description, image } = req.body;
    try {
        await Event.findByIdAndUpdate(req.params.id, { title, date, location, description, image: image || null });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update event.' });
    }
});

// Delete an event (Protected)
app.delete('/api/events/:id', authenticateToken, async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete event.' });
    }
});

// --- PAGES CMS API ---

// Get content for a specific page (Public)
app.get('/api/pages/:page_name', async (req, res) => {
    try {
        const page = await Page.findOne({ page_name: req.params.page_name });
        if (!page) return res.status(404).json({ error: 'Page not found.' });
        res.json(JSON.parse(page.content));
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve page content.' });
    }
});

// Update content for a specific page (Protected)
app.put('/api/pages/:page_name', authenticateToken, async (req, res) => {
    const content = JSON.stringify(req.body);
    try {
        await Page.findOneAndUpdate(
            { page_name: req.params.page_name },
            { content },
            { upsert: true, new: true }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update page content.' });
    }
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
