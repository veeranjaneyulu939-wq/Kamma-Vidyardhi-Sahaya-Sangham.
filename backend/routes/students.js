const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { initDB } = require('../config/db');
const multer = require('multer');
const xlsx = require('xlsx');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @route   GET api/students
router.get('/', auth, async (req, res) => {
  try {
    const db = await initDB();
    const students = await db.all('SELECT * FROM students ORDER BY hostelId');
    // Map id to _id for frontend compatibility
    const mapped = students.map(s => ({ ...s, _id: s.id }));
    res.json(mapped);
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

    const db = await initDB();
    let addedCount = 0;

    await db.exec('BEGIN TRANSACTION');
    
    for (let rawRow of data) {
      // Normalize keys: convert to lowercase and remove spaces
      const row = {};
      for (const key in rawRow) {
        const normalizedKey = key.toLowerCase().replace(/\s+/g, '');
        row[normalizedKey] = rawRow[key];
      }

      const rawValues = Object.values(rawRow);

      // Check for Hostel ID (hostelid, id, rollno) OR fallback to Column 1
      const parsedHostelId = row.hostelid || row.id || row.rollno || rawValues[0];
      // Check for Student Name (studentname, name) OR fallback to Column 2
      const parsedStudentName = row.studentname || row.name || row.student || rawValues[1];

      if (!parsedHostelId || !parsedStudentName) {
        console.log("Skipping invalid row:", rawRow);
        continue;
      }
      
      const hostelIdStr = String(parsedHostelId);
      const existing = await db.get('SELECT id FROM students WHERE hostelId = ?', [hostelIdStr]);
      
      if (!existing) {
        await db.run(
          `INSERT INTO students (hostelId, studentName, college, year, courseType, branch, roomNo, phoneNumber) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            hostelIdStr, 
            parsedStudentName, 
            row.college || rawValues[2] || 'Unknown', 
            row.year ? parseInt(row.year, 10) : 1, 
            row.coursetype || row.course || rawValues[3] || 'B.Tech', 
            row.branch || rawValues[4] || 'N/A', 
            row.roomno || row.room ? String(row.roomno || row.room) : '', 
            row.phonenumber || row.phone ? String(row.phonenumber || row.phone) : ''
          ]
        );
        addedCount++;
      }
    }

    await db.exec('COMMIT');
    res.json({ msg: `Successfully imported ${addedCount} students.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error processing Excel file');
  }
});

module.exports = router;
