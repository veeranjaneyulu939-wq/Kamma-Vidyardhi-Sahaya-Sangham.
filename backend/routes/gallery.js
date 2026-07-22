const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');

// POST /api/gallery - Add a photo
router.post('/', async (req, res) => {
  try {
    const { title, imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ msg: 'No image uploaded' });
    }
    
    const newPhoto = new Gallery({
      title: title || 'Untitled',
      imageUrl
    });
    
    await newPhoto.save();
    res.json({ id: newPhoto._id, ...newPhoto._doc });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/gallery - Get all photos
router.get('/', async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ uploadedAt: -1 });
    res.json(photos.map(p => ({ id: p._id, ...p._doc })));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE /api/gallery/:id - Delete a photo
router.delete('/:id', async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    if (!photo) return res.status(404).json({ msg: 'Photo not found' });
    
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Photo removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
