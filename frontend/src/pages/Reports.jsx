import React, { useState } from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import api from '../api';

const Reports = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleDownloadPDF = async () => {
    try {
      // In a real app with auth, you might need to handle the blob response
      // For this simple version, we'll open a new window to trigger download
      // but attach the token if needed
      
      const token = localStorage.getItem('token');
      const url = `https://kamma-backend-939.loca.lt/api/attendance/export/pdf/${date}?token=${token}`;
      window.open(url, '_blank');
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to download PDF. Please check server connection.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Reports & Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Report Card */}
        <div className="bg-white p-8 rounded-lg shadow-sm border-t-4 border-gold">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="text-navy" size={28} />
            <h2 className="text-xl font-semibold text-gray-800">Daily Attendance Report</h2>
          </div>
          <p className="text-gray-500 mb-6">Generate a printable PDF report of student attendance for any specific date.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={handleDownloadPDF}
                className="w-1/2 flex justify-center items-center space-x-2 bg-navy text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Download size={20} />
                <span>PDF Report</span>
              </button>
              <button 
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('token');
                    // Dynamically point to the backend port
                    const url = `https://kamma-backend-939.loca.lt/api/attendance/export/excel/${date}?token=${token}`;
                    window.open(url, '_blank');
                  } catch (err) {
                    console.error("Download failed", err);
                    alert("Failed to download Excel. Please check server connection.");
                  }
                }}
                className="w-1/2 flex justify-center items-center space-x-2 bg-green-700 text-white py-3 px-4 rounded-lg hover:bg-green-800 transition-colors"
              >
                <Download size={20} />
                <span>Excel Sheet</span>
              </button>
            </div>
          </div>
        </div>

        {/* Monthly Analytics Card */}
        <div className="bg-white p-8 rounded-lg shadow-sm border-t-4 border-gold">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="text-navy" size={28} />
            <h2 className="text-xl font-semibold text-gray-800">Monthly Analytics</h2>
          </div>
          <p className="text-gray-500 mb-6">Generate detailed Excel sheets calculating monthly percentages for all students.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
              <div className="relative">
                <input 
                  type="month" 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                  value={date.substring(0, 7)} // Get YYYY-MM
                  onChange={(e) => setDate(e.target.value + '-01')}
                />
                <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>

            <button 
              onClick={async () => {
                try {
                  const token = localStorage.getItem('token');
                  const month = date.substring(0, 7);
                  const url = `https://kamma-backend-939.loca.lt/api/attendance/export/monthly/${month}?token=${token}`;
                  window.open(url, '_blank');
                } catch (err) {
                  console.error("Download failed", err);
                  alert("Failed to download Excel. Please check server connection.");
                }
              }}
              className="w-full flex justify-center items-center space-x-2 bg-green-700 text-white py-3 px-4 rounded-lg hover:bg-green-800 transition-colors"
            >
              <Download size={20} />
              <span>Download Excel Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
