const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled' },
  imageUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', GallerySchema);
