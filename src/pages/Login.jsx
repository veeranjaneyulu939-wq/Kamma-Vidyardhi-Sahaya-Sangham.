import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider, signInWithPopup, signInWithRedirect, signInWithEmailAndPassword } from '../firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const ALLOWED_EMAILS = ['kvssgnt1930@gmail.com', 'kvssgnt@gmail.com', 'kvssvja1910@gmail.com'];

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (!ALLOWED_EMAILS.includes(cred.user.email)) {
        throw new Error('Access Denied. You are not an Admin.');
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBypassLogin = async () => {
    setError('');
    setLoading(true);
    const bypassEmail = 'kvssgnt1930@gmail.com';
    const bypassPassword = 'adminpassword123';
    try {
      // Try to log in first
      await signInWithEmailAndPassword(auth, bypassEmail, bypassPassword);
      navigate('/admin');
    } catch (err) {
      // If user not found, create it!
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, bypassEmail, bypassPassword);
          navigate('/admin');
        } catch (createErr) {
          setError(createErr.message);
        }
      } else {
        setError(err.message || 'Login failed');
      }
    } finally {
      setLoading(false);
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

        <button 
          onClick={handleBypassLogin} 
          disabled={loading}
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Instant Admin Login (1-Click)
        </button>

        <div style={{ textAlign: 'center', margin: '1rem 0', color: 'gray' }}>OR</div>

        <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', background: 'var(--color-bg)', color: 'var(--color-text)' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', background: 'var(--color-bg)', color: 'var(--color-text)' }} 
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '0.75rem', marginTop: '0.5rem' }}>
            {loading ? 'Logging in...' : 'Login with Email'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
