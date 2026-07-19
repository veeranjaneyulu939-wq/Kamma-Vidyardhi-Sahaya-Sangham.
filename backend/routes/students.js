const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { db } = require('../config/firebase');
const multer = require('multer');
const xlsx = require('xlsx');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @route   GET api/students
router.get('/', auth, async (req, res) => {
  try {
    const snapshot = await db.collection('students').orderBy('hostelId').get();
    const students = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
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

    const studentsRef = db.collection('students');
    const batch = db.batch();
    let addedCount = 0;

    for (let row of data) {
      if (!row.HostelID || !row.StudentName) continue;
      
      const hostelIdStr = String(row.HostelID);
      const existing = await studentsRef.where('hostelId', '==', hostelIdStr).get();
      
      if (existing.empty) {
        const docRef = studentsRef.doc();
        batch.set(docRef, {
          hostelId: hostelIdStr,
          studentName: row.StudentName,
          college: row.College || 'Unknown',
          year: row.Year ? parseInt(row.Year, 10) : 1,
          courseType: row.CourseType || 'B.Tech',
          branch: row.Branch || 'N/A',
          roomNo: row.RoomNo ? String(row.RoomNo) : '',
          phoneNumber: row.PhoneNumber ? String(row.PhoneNumber) : '',
          createdAt: new Date().toISOString()
        });
        addedCount++;
      }
    }

    if (addedCount > 0) {
      await batch.commit();
    }

    res.json({ msg: `Successfully imported ${addedCount} students.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error processing Excel file');
  }
});

module.exports = router;
