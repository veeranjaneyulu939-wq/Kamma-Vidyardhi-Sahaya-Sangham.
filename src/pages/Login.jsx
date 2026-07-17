import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider, signInWithRedirect, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from '../firebase';

const Login = () => {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const ALLOWED_EMAILS = ['kvssgnt1930@gmail.com', 'kvssgnt@gmail.com', 'kvssvja1910@gmail.com', 'superadmin@kammahostel.com', 'kammahostelgnt1930@gmail.com', 'kammahostel1930@gnt.com'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (ALLOWED_EMAILS.includes(user.email)) {
          navigate('/admin');
        } else {
          setError('Access Denied. You are not an Admin.');
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // navigation is handled by onAuthStateChanged
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Did you create this user in Firebase Console?');
      } else {
        setError(err.message || 'Login failed');
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await signInWithRedirect(auth, provider);
    } catch (err) {
      setError(err.message || 'Google Login failed');
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your admin email in the box first to reset password.');
      return;
    }
    setError('');
    setMessage('');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to send reset email.');
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
        {message && (
          <div style={{ background: '#dcfce7', color: '#166534', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>
            {message}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', color: 'gray', padding: '2rem' }}>
            Checking authentication...
          </div>
        ) : (
          <div>
            <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
                  backgroundColor: 'var(--color-secondary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}
              >
                Sign In with Email
              </button>
            </form>

            <div style={{ textAlign: 'right', marginTop: '10px' }}>
              <button 
                type="button"
                onClick={handleForgotPassword}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Forgot Password?
              </button>
            </div>

            <div style={{ textAlign: 'center', margin: '20px 0', color: '#666', fontWeight: 'bold' }}>OR</div>

            <button 
              type="button"
              onClick={handleGoogleLogin} 
              style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '24px', background: 'white', borderRadius: '50%', padding: '2px' }} />
              Sign in with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
