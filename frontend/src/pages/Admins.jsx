import React, { useState, useEffect } from 'react';
import { UserPlus, ShieldAlert, Users } from 'lucide-react';
import api from '../api';

const Admins = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [adminsList, setAdminsList] = useState([]);

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/auth/admins');
      setAdminsList(res.data);
    } catch (err) {
      console.error("Failed to fetch admins", err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
      const res = await api.post('/auth/register', formData);
      setMessage(res.data.msg);
      setFormData({ username: '', email: '', password: '' });
      fetchAdmins(); // refresh the list
    } catch (err) {
      setError(err.response?.data?.msg || 'Error creating admin');
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy mb-6">Admin Settings</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm border-t-4 border-gold">
          <div className="flex items-center space-x-3 mb-6">
            <UserPlus className="text-navy" size={28} />
            <h2 className="text-xl font-semibold text-gray-800">Add New Admin</h2>
          </div>
          
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg flex items-start space-x-3 text-yellow-800">
            <ShieldAlert size={20} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm">Only create admin accounts for trusted hostel wardens or staff. They will have full access.</p>
          </div>

          {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{message}</div>}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username / Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                required
                minLength="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-navy text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors mt-6 font-medium"
            >
              Create Admin Account
            </button>
          </form>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-transparent mb-6 hidden md:block">-</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm border-t-4 border-navy">
          <div className="flex items-center space-x-3 mb-6">
            <Users className="text-navy" size={28} />
            <h2 className="text-xl font-semibold text-gray-800">Current Admins</h2>
          </div>
          
          <div className="space-y-4">
            {adminsList.map((admin) => (
              <div key={admin.id} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-navy">{admin.username}</h3>
                  <p className="text-sm text-gray-500">{admin.email}</p>
                </div>
                <span className="bg-gold/20 text-navy text-xs px-2 py-1 rounded font-bold uppercase tracking-wide">
                  {admin.role}
                </span>
              </div>
            ))}
            
            {adminsList.length === 0 && (
              <p className="text-gray-500 text-sm italic">Loading admins...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admins;
