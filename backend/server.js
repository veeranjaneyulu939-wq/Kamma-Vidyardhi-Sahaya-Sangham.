const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Middleware Setup
app.use(cors());
app.use(express.json({ extended: false }));

// Initialize Database
const connectDB = require('./config/db');
connectDB();

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/events', require('./routes/events'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/contact', require('./routes/contact'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
