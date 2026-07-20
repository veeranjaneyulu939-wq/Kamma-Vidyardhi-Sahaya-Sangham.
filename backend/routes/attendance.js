const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { initDB } = require('../config/db');

// @route   GET api/attendance/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const db = await initDB();
    
    const countRes = await db.get('SELECT COUNT(*) as count FROM students');
    const totalStudents = countRes.count;

    const today = new Date().toISOString().split('T')[0];

    const records = await db.all('SELECT status FROM attendance WHERE date = ?', [today]);
    
    let present = 0, absent = 0, leave = 0;
    records.forEach(doc => {
      if (doc.status === 'Present') present++;
      else if (doc.status === 'Absent') absent++;
      else if (doc.status === 'Leave') leave++;
    });

    res.json({ totalStudents, present, absent, leave });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/attendance/date/:date
router.get('/date/:date', auth, async (req, res) => {
  try {
    const db = await initDB();
    const records = await db.all('SELECT studentId as student, status FROM attendance WHERE date = ?', [req.params.date]);
    res.json(records);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/attendance/mark
router.post('/mark', auth, async (req, res) => {
  const { date, records } = req.body;
  try {
    const db = await initDB();
    await db.exec('BEGIN TRANSACTION');
    
    for (let r of records) {
      await db.run(
        `INSERT INTO attendance (date, studentId, status) VALUES (?, ?, ?)
         ON CONFLICT(date, studentId) DO UPDATE SET status=excluded.status`,
        [date, r.studentId, r.status]
      );
    }
    
    await db.exec('COMMIT');
    res.json({ msg: 'Attendance saved' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/attendance/export/pdf/:date
router.get('/export/pdf/:date', async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(401).send('No token');
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET || 'secret';
    try { jwt.verify(token, secret); } catch(e) { return res.status(401).send('Invalid token'); }

    const db = await initDB();
    const date = req.params.date;
    
    // Join attendance with students to get names and status
    const records = await db.all(`
      SELECT s.hostelId, s.studentName, s.roomNo, a.status 
      FROM students s 
      LEFT JOIN attendance a ON s.id = a.studentId AND a.date = ?
      ORDER BY s.hostelId
    `, [date]);

    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();

    res.setHeader('Content-disposition', `attachment; filename=Attendance_${date}.pdf`);
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(20).text(`Kamma Hostel Attendance Report`, { align: 'center' });
    doc.fontSize(14).text(`Date: ${date}`, { align: 'center' });
    doc.moveDown();

    let present = 0, absent = 0, leave = 0, notMarked = 0;

    records.forEach(r => {
      const status = r.status || 'Not Marked';
      if(status === 'Present') present++;
      else if(status === 'Absent') absent++;
      else if(status === 'Leave') leave++;
      else notMarked++;
    });

    doc.fontSize(12).text(`Summary: ${present} Present | ${absent} Absent | ${leave} Leave | ${notMarked} Not Marked`);
    doc.moveDown();

    doc.fontSize(10);
    records.forEach(r => {
      const status = r.status || 'Not Marked';
      doc.text(`[${r.hostelId}] ${r.studentName} (Room: ${r.roomNo || 'N/A'}) - ${status}`);
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error generating PDF');
  }
});

// @route   GET api/attendance/export/excel/:date
router.get('/export/excel/:date', async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(401).send('No token');
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET || 'secret';
    try { jwt.verify(token, secret); } catch(e) { return res.status(401).send('Invalid token'); }

    const db = await initDB();
    const date = req.params.date;
    
    const records = await db.all(`
      SELECT 
        s.id, s.hostelId, s.studentName, s.phoneNumber, a.status as todayStatus,
        (SELECT COUNT(*) FROM attendance WHERE studentId = s.id AND status = 'Present') as presentDays,
        (SELECT COUNT(*) FROM attendance WHERE studentId = s.id) as totalDays
      FROM students s 
      LEFT JOIN attendance a ON s.id = a.studentId AND a.date = ?
      ORDER BY s.hostelId
    `, [date]);

    const xlsx = require('xlsx');
    
    // Calculate daily overview
    let dailyPresent = 0;
    records.forEach(r => {
      if (r.todayStatus === 'Present') dailyPresent++;
    });
    const dailyPercentage = records.length > 0 ? Math.round((dailyPresent / records.length) * 100) : 0;

    const excelData = records.map(r => {
      const histPercentage = r.totalDays > 0 ? Math.round((r.presentDays / r.totalDays) * 100) + '%' : 'N/A';
      return {
        "Hostel ID": r.hostelId,
        "Student Name": r.studentName,
        "Phone Number": r.phoneNumber || 'N/A',
        "Today's Status": r.todayStatus || 'Not Marked',
        "Overall Attendance %": histPercentage
      };
    });

    const worksheet = xlsx.utils.json_to_sheet(excelData);
    
    // Add a daily overview row at the bottom
    xlsx.utils.sheet_add_json(worksheet, [
      {}, // Empty row for spacing
      { "Hostel ID": "DAILY OVERVIEW", "Student Name": "Total Present:", "Phone Number": dailyPresent, "Today's Status": "Overall %:", "Overall Attendance %": `${dailyPercentage}%` }
    ], { skipHeader: true, origin: -1 });

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, `Attendance_${date}`);

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-disposition', `attachment; filename=Attendance_${date}.xlsx`);
    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error generating Excel');
  }
});

// @route   GET api/attendance/export/monthly/:month
// :month format expected as YYYY-MM
router.get('/export/monthly/:month', async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(401).send('No token');
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET || 'secret';
    try { jwt.verify(token, secret); } catch(e) { return res.status(401).send('Invalid token'); }

    const db = await initDB();
    const month = req.params.month; // e.g. "2026-07"
    
    // Find total distinct working days in that month
    const daysRes = await db.get(`SELECT COUNT(DISTINCT date) as totalWorkingDays FROM attendance WHERE date LIKE ?`, [`${month}-%`]);
    const totalWorkingDays = daysRes.totalWorkingDays || 0;

    const students = await db.all('SELECT id, hostelId, studentName, college, phoneNumber FROM students ORDER BY hostelId');
    
    const excelData = [];
    for (let s of students) {
      const presentRes = await db.get(`SELECT COUNT(*) as presentCount FROM attendance WHERE studentId = ? AND date LIKE ? AND status = 'Present'`, [s.id, `${month}-%`]);
      const absentRes = await db.get(`SELECT COUNT(*) as absentCount FROM attendance WHERE studentId = ? AND date LIKE ? AND status = 'Absent'`, [s.id, `${month}-%`]);
      const leaveRes = await db.get(`SELECT COUNT(*) as leaveCount FROM attendance WHERE studentId = ? AND date LIKE ? AND status = 'Leave'`, [s.id, `${month}-%`]);
      
      const present = presentRes.presentCount;
      const absent = absentRes.absentCount;
      const leave = leaveRes.leaveCount;
      const totalMarked = present + absent + leave;
      
      // Percentage based on total working days (so if they missed days, it counts against them)
      const percentage = totalWorkingDays > 0 ? Math.round((present / totalWorkingDays) * 100) + '%' : 'N/A';

      excelData.push({
        "Hostel ID": s.hostelId,
        "Student Name": s.studentName,
        "College": s.college,
        "Phone": s.phoneNumber,
        "Present": present,
        "Absent": absent,
        "Leave": leave,
        "Total Marked Days": totalMarked,
        "Monthly Attendance %": percentage
      });
    }

    const xlsx = require('xlsx');
    const worksheet = xlsx.utils.json_to_sheet(excelData);
    
    // Add Summary Row
    xlsx.utils.sheet_add_json(worksheet, [
      {}, 
      { "Hostel ID": "MONTHLY SUMMARY", "Student Name": `Total Working Days: ${totalWorkingDays}` }
    ], { skipHeader: true, origin: -1 });

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, `Analytics_${month}`);

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-disposition', `attachment; filename=Monthly_Analytics_${month}.xlsx`);
    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error generating Monthly Excel');
  }
});

module.exports = router;
