import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const ALLOWED_EMAILS = ['kvssgnt1930@gmail.com', 'kvssgnt@gmail.com', 'kvssvja1910@gmail.com', 'superadmin@kammahostel.com', 'kammahostelgnt1930@gmail.com'];

  useEffect(() => {
    if (localStorage.getItem('adminBypass') === 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    // Check if email is in allowed list and password is correct
    if (ALLOWED_EMAILS.includes(email.toLowerCase()) && password === 'kamma1930') {
      localStorage.setItem('adminBypass', 'true');
      localStorage.setItem('adminEmail', email.toLowerCase());
      navigate('/admin');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="section" style={{ background: 'var(--color-bg)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--color-primary)' }}>Admin Login</h2>
        
        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Admin Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', fontSize: '1rem' }}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', fontSize: '1rem' }}
          />
          <button 
            type="submit"
            style={{
              padding: '12px',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            Secure Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
