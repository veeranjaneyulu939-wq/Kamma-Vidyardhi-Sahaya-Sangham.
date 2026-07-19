import React, { useState, useEffect } from 'react';
import api from '../api';
import { Calendar, Save, CheckCircle, XCircle, MinusCircle } from 'lucide-react';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({}); // { studentId: 'Present/Absent/Leave' }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all students
        const studentsRes = await api.get('/students');
        setStudents(studentsRes.data);
        
        // Fetch existing attendance for this date
        const attendanceRes = await api.get(`/attendance/date/${date}`);
        const existingMap = {};
        attendanceRes.data.forEach(record => {
          // record.student is populated, but we just need the status mapped by student _id
          existingMap[record.student?._id || record.student] = record.status;
        });
        
        setAttendance(existingMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [date]);

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    // Format records array: [{ studentId, status }]
    const records = Object.keys(attendance).map(studentId => ({
      studentId,
      status: attendance[studentId]
    }));

    if (records.length === 0) {
      setMessage({ type: 'error', text: 'No attendance marked to save.' });
      setSaving(false);
      return;
    }

    try {
      await api.post('/attendance/mark', { date, records });
      setMessage({ type: 'success', text: 'Attendance saved successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save attendance.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-navy">Mark Attendance</h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="date" 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-gold text-navy font-semibold px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-yellow-500 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            <span>{saving ? 'Saving...' : 'Save Attendance'}</span>
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-lg border-l-4 ${message.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
          <p>{message.text}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading student list...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-600 w-24">Room No</th>
                  <th className="p-4 font-semibold text-gray-600">Student Name</th>
                  <th className="p-4 font-semibold text-gray-600 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-500">No students available. Please add students first.</td>
                  </tr>
                ) : (
                  students.map((student) => {
                    const status = attendance[student._id];
                    return (
                      <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-600">{student.roomNo}</td>
                        <td className="p-4">
                          <p className="font-medium text-navy">{student.studentName}</p>
                          <p className="text-xs text-gray-500">ID: {student.hostelId} | {student.courseType}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center space-x-2">
                            <button 
                              onClick={() => handleStatusChange(student._id, 'Present')}
                              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${status === 'Present' ? 'bg-green-100 text-green-700 border-2 border-green-500' : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-green-50'}`}
                            >
                              <CheckCircle size={16} /> <span>Present</span>
                            </button>
                            
                            <button 
                              onClick={() => handleStatusChange(student._id, 'Absent')}
                              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${status === 'Absent' ? 'bg-red-100 text-red-700 border-2 border-red-500' : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-red-50'}`}
                            >
                              <XCircle size={16} /> <span>Absent</span>
                            </button>
                            
                            <button 
                              onClick={() => handleStatusChange(student._id, 'Leave')}
                              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${status === 'Leave' ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-500' : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-yellow-50'}`}
                            >
                              <MinusCircle size={16} /> <span>Leave</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
