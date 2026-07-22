const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const xlsx = require('xlsx');

const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @route   GET api/students
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find().sort({ hostelId: 1 });
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/students/upload
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let addedCount = 0;
    
    for (let rawRow of data) {
      const row = {};
      for (const key in rawRow) {
        const normalizedKey = key.toLowerCase().replace(/\s+/g, '');
        row[normalizedKey] = rawRow[key];
      }

      const rawValues = Object.values(rawRow);

      const parsedHostelId = row.hostelid || row.id || row.rollno || rawValues[0];
      const parsedStudentName = row.studentname || row.name || row.student || rawValues[1];

      if (!parsedHostelId || !parsedStudentName) {
        continue;
      }
      
      const hostelIdStr = String(parsedHostelId);
      const existing = await Student.findOne({ hostelId: hostelIdStr });
      
      if (!existing) {
        const student = new Student({
          hostelId: hostelIdStr,
          studentName: parsedStudentName,
          college: row.college || rawValues[2] || 'Unknown',
          year: row.year ? String(row.year) : '1',
          courseType: row.coursetype || row.course || rawValues[3] || 'B.Tech',
          roomNo: row.roomno || row.room ? String(row.roomno || row.room) : 'N/A',
          phoneNumber: row.phonenumber || row.phone ? String(row.phonenumber || row.phone) : 'N/A'
        });
        await student.save();
        addedCount++;
      }
    }

    res.json({ msg: `Successfully imported ${addedCount} students.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error processing Excel file');
  }
});

// @route   DELETE api/students/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    // Delete attendance records for this student first to avoid orphaned data
    await Attendance.deleteMany({ studentId: req.params.id });
    
    // Delete the student
    const result = await Student.findByIdAndDelete(req.params.id);
    
    if (!result) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    
    res.json({ msg: 'Student removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
