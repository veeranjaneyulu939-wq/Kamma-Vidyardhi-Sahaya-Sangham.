import React, { useState, useEffect } from 'react';
import api from '../api';
import { Upload, Search, Trash2 } from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setMessage('');

    try {
      const res = await api.post('/students/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage({ type: 'success', text: res.data.msg });
      fetchStudents(); // Refresh the list
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.msg || 'Failed to upload Excel file.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteStudent = async (id, name) => {
    if (window.confirm(`Are you sure you want to completely remove ${name}? This will also delete their attendance history.`)) {
      try {
        await api.delete(`/students/${id}`);
        setMessage({ type: 'success', text: `${name} has been removed.` });
        fetchStudents(); // Refresh the list
      } catch (err) {
        console.error(err);
        setMessage({ type: 'error', text: err.response?.data?.msg || 'Failed to delete student.' });
      }
    }
  };

  const filteredStudents = students.filter(s => 
    s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.hostelId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Manage Students</h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by Name or ID" 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <label className="cursor-pointer bg-navy text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors">
            <Upload size={18} />
            <span>{uploading ? 'Uploading...' : 'Import Excel'}</span>
            <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-lg border-l-4 ${message.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
          <p>{message.text}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading students...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-600">Hostel ID</th>
                  <th className="p-4 font-semibold text-gray-600">Name</th>
                  <th className="p-4 font-semibold text-gray-600">College</th>
                  <th className="p-4 font-semibold text-gray-600">Course</th>
                  <th className="p-4 font-semibold text-gray-600">Room No</th>
                  <th className="p-4 font-semibold text-gray-600">Phone</th>
                  <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">No students found.</td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">{student.hostelId}</td>
                      <td className="p-4 font-medium text-navy">{student.studentName}</td>
                      <td className="p-4">{student.college}</td>
                      <td className="p-4">{student.courseType} (Yr {student.year})</td>
                      <td className="p-4">{student.roomNo}</td>
                      <td className="p-4">{student.phoneNumber}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteStudent(student._id, student.studentName)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
