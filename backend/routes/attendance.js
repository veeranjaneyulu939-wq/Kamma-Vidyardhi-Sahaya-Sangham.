const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

// @route   GET api/attendance/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const today = new Date().toISOString().split('T')[0];

    const records = await Attendance.find({ date: today });
    
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
    const records = await Attendance.find({ date: req.params.date });
    const mapped = records.map(r => ({ student: r.studentId, status: r.status }));
    res.json(mapped);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/attendance/mark
router.post('/mark', auth, async (req, res) => {
  const { date, records } = req.body;
  try {
    for (let r of records) {
      await Attendance.findOneAndUpdate(
        { date, studentId: r.studentId },
        { status: r.status },
        { upsert: true, new: true }
      );
    }
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

    const date = req.params.date;
    
    const students = await Student.find().sort({ hostelId: 1 }).lean();
    const attendances = await Attendance.find({ date }).lean();
    
    const attendanceMap = {};
    attendances.forEach(a => {
      attendanceMap[a.studentId.toString()] = a.status;
    });

    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();

    res.setHeader('Content-disposition', `attachment; filename=Attendance_${date}.pdf`);
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(20).text(`Kamma Hostel Attendance Report`, { align: 'center' });
    doc.fontSize(14).text(`Date: ${date}`, { align: 'center' });
    doc.moveDown();

    let present = 0, absent = 0, leave = 0, notMarked = 0;

    students.forEach(s => {
      const status = attendanceMap[s._id.toString()] || 'Not Marked';
      if(status === 'Present') present++;
      else if(status === 'Absent') absent++;
      else if(status === 'Leave') leave++;
      else notMarked++;
    });

    doc.fontSize(12).text(`Summary: ${present} Present | ${absent} Absent | ${leave} Leave | ${notMarked} Not Marked`);
    doc.moveDown();

    doc.fontSize(10);
    students.forEach(s => {
      const status = attendanceMap[s._id.toString()] || 'Not Marked';
      doc.text(`[${s.hostelId}] ${s.studentName} (Room: ${s.roomNo || 'N/A'}) - ${status}`);
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

    const date = req.params.date;
    
    const students = await Student.find().sort({ hostelId: 1 }).lean();
    const allAttendances = await Attendance.find().lean();
    
    const todayMap = {};
    const presentCountMap = {};
    const totalCountMap = {};
    
    allAttendances.forEach(a => {
      const sId = a.studentId.toString();
      if (!totalCountMap[sId]) totalCountMap[sId] = 0;
      if (!presentCountMap[sId]) presentCountMap[sId] = 0;
      
      totalCountMap[sId]++;
      if (a.status === 'Present') presentCountMap[sId]++;
      if (a.date === date) todayMap[sId] = a.status;
    });

    const xlsx = require('xlsx');
    
    let dailyPresent = 0;
    students.forEach(s => {
      const status = todayMap[s._id.toString()];
      if (status === 'Present') dailyPresent++;
    });
    const dailyPercentage = students.length > 0 ? Math.round((dailyPresent / students.length) * 100) : 0;

    const excelData = students.map(s => {
      const sId = s._id.toString();
      const tDays = totalCountMap[sId] || 0;
      const pDays = presentCountMap[sId] || 0;
      const histPercentage = tDays > 0 ? Math.round((pDays / tDays) * 100) + '%' : 'N/A';
      return {
        "Hostel ID": s.hostelId,
        "Student Name": s.studentName,
        "Phone Number": s.phoneNumber || 'N/A',
        "Today's Status": todayMap[sId] || 'Not Marked',
        "Overall Attendance %": histPercentage
      };
    });

    const worksheet = xlsx.utils.json_to_sheet(excelData);
    
    xlsx.utils.sheet_add_json(worksheet, [
      {}, 
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
router.get('/export/monthly/:month', async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(401).send('No token');
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET || 'secret';
    try { jwt.verify(token, secret); } catch(e) { return res.status(401).send('Invalid token'); }

    const month = req.params.month; // e.g. "2026-07"
    
    const students = await Student.find().sort({ hostelId: 1 }).lean();
    const monthlyAttendances = await Attendance.find({ date: { $regex: '^' + month } }).lean();
    
    const uniqueDates = new Set();
    monthlyAttendances.forEach(a => uniqueDates.add(a.date));
    const totalWorkingDays = uniqueDates.size;
    
    const excelData = students.map(s => {
      const sId = s._id.toString();
      let present = 0, absent = 0, leave = 0;
      
      monthlyAttendances.forEach(a => {
        if (a.studentId.toString() === sId) {
          if (a.status === 'Present') present++;
          if (a.status === 'Absent') absent++;
          if (a.status === 'Leave') leave++;
        }
      });
      
      const totalMarked = present + absent + leave;
      const percentage = totalWorkingDays > 0 ? Math.round((present / totalWorkingDays) * 100) + '%' : 'N/A';

      return {
        "Hostel ID": s.hostelId,
        "Student Name": s.studentName,
        "College": s.college,
        "Phone": s.phoneNumber,
        "Present": present,
        "Absent": absent,
        "Leave": leave,
        "Total Marked Days": totalMarked,
        "Monthly Attendance %": percentage
      };
    });

    const xlsx = require('xlsx');
    const worksheet = xlsx.utils.json_to_sheet(excelData);
    
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
