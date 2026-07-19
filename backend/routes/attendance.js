const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { db } = require('../config/firebase');

// @route   GET api/attendance/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const studentsSnapshot = await db.collection('students').count().get();
    const totalStudents = studentsSnapshot.data().count;

    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD

    const attendanceSnapshot = await db.collection('attendance')
      .where('date', '==', dateString)
      .get();
    
    let present = 0, absent = 0, leave = 0;
    attendanceSnapshot.forEach(doc => {
      const status = doc.data().status;
      if (status === 'Present') present++;
      else if (status === 'Absent') absent++;
      else if (status === 'Leave') leave++;
    });

    res.json({
      totalStudents,
      present,
      absent,
      leave
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
