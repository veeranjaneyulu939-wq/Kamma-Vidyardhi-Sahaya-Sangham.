const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { initDB } = require('../config/db');

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// POST api/gallery - Upload a new photo
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const db = await initDB();
    const { title } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ msg: 'No image uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const result = await db.run(
      'INSERT INTO gallery_photos (title, imageUrl) VALUES (?, ?)',
      [title || 'Untitled', imageUrl]
    );

    const newPhoto = await db.get('SELECT * FROM gallery_photos WHERE id = ?', [result.lastID]);
    res.json(newPhoto);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET api/gallery - Get all photos
router.get('/', async (req, res) => {
  try {
    const db = await initDB();
    const photos = await db.all('SELECT * FROM gallery_photos ORDER BY uploadedAt DESC');
    res.json(photos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE api/gallery/:id - Delete a photo
router.delete('/:id', async (req, res) => {
  try {
    const db = await initDB();
    const photo = await db.get('SELECT * FROM gallery_photos WHERE id = ?', [req.params.id]);
    
    if (!photo) return res.status(404).json({ msg: 'Photo not found' });

    // Delete file
    const filePath = path.join(__dirname, '..', photo.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await db.run('DELETE FROM gallery_photos WHERE id = ?', [req.params.id]);
    res.json({ msg: 'Photo removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
