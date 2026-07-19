import React, { useState, useEffect } from 'react';
import api from '../api';
import { QRCodeSVG } from 'qrcode.react';
import { Search, Printer } from 'lucide-react';

const QRCodes = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
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
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(s => 
    s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.hostelId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 no-print">
        <h1 className="text-2xl font-bold text-navy">Student QR Codes</h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search Name/ID" 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <button 
            onClick={handlePrint}
            className="bg-navy text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
          >
            <Printer size={18} />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading students...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 print:grid-cols-4 print:gap-4 print:bg-white">
          {filteredStudents.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-500">No students found.</div>
          ) : (
            filteredStudents.map((student) => (
              <div key={student._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center print:shadow-none print:border-gray-300 print:break-inside-avoid">
                <div className="mb-4 p-2 bg-white rounded-lg border-2 border-gold">
                  <QRCodeSVG 
                    value={student.hostelId} 
                    size={120} 
                    level={"H"}
                    fgColor="#0B1F3A" 
                  />
                </div>
                <h3 className="font-bold text-navy text-lg leading-tight">{student.studentName}</h3>
                <p className="text-sm font-semibold text-gold mt-1">{student.hostelId}</p>
                <p className="text-xs text-gray-500 mt-2">Room: {student.roomNo} | {student.courseType}</p>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Print styles inserted directly for simplicity */}
      <style>{`
        @media print {
          body { background-color: white; }
          .no-print { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-gray-300 { border-color: #d1d5db !important; }
          .print\\:break-inside-avoid { break-inside: avoid !important; }
          .print\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
          .print\\:gap-4 { gap: 1rem !important; }
          .print\\:bg-white { background-color: white !important; }
        }
      `}</style>
    </div>
  );
};

export default QRCodes;
