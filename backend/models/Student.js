const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  hostelId: { type: String, required: true, unique: true },
  college: { type: String, required: true },
  year: { type: String, required: true },
  courseType: { type: String, required: true },
  roomNo: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);
