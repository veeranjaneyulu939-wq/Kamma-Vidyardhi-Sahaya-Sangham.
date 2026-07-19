import React, { useState, useEffect } from 'react';
import api from '../api';
import { Users, UserCheck, UserX, UserMinus } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    present: 0,
    absent: 0,
    leave: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/attendance/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Students', value: stats.totalStudents, icon: <Users size={24} className="text-navy" />, border: 'border-navy' },
    { title: 'Present Today', value: stats.present, icon: <UserCheck size={24} className="text-green-600" />, border: 'border-green-500' },
    { title: 'Absent Today', value: stats.absent, icon: <UserX size={24} className="text-red-600" />, border: 'border-red-500' },
    { title: 'On Leave', value: stats.leave, icon: <UserMinus size={24} className="text-gold" />, border: 'border-gold' }
  ];

  if (loading) {
    return <div className="flex justify-center mt-10"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Dashboard Overview</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${card.border} flex items-center justify-between`}>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
              <p className="text-3xl font-bold text-navy mt-2">{card.value}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-full">
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
