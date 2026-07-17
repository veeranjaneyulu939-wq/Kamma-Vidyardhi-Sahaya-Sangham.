import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider, signInWithRedirect, onAuthStateChanged } from '../firebase';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const ALLOWED_EMAILS = ['kvssgnt1930@gmail.com', 'kvssgnt@gmail.com', 'kvssvja1910@gmail.com', 'superadmin@kammahostel.com', 'kammahostelgnt1930@gmail.com'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (ALLOWED_EMAILS.includes(user.email)) {
          navigate('/admin');
        } else {
          setError('Access Denied. You are not an Admin.');
          setLoading(false);
          // Sign out unauthorized users immediately? Yes, but Admin.jsx handles that too.
        }
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // Use redirect instead of popup to fix popup-blockers and cross-origin issues
      await signInWithRedirect(auth, provider);
    } catch (err) {
      setError(err.message || 'Login failed');
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

        {loading ? (
          <div style={{ textAlign: 'center', color: 'gray', padding: '2rem' }}>
            Checking authentication...
          </div>
        ) : (
          <div>
            <button 
              onClick={handleGoogleLogin} 
              disabled={loading}
              style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '24px', background: 'white', borderRadius: '50%', padding: '2px' }} />
              Sign in with Google
            </button>
            <button 
              onClick={() => {
                localStorage.setItem('adminBypass', 'true');
                navigate('/admin');
              }} 
              style={{
                marginTop: '15px',
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                width: '100%'
              }}
            >
              Emergency Bypass Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
