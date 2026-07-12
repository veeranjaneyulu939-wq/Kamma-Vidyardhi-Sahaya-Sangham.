import React, { useState, useEffect } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState({
    title: 'Contact Us',
    subtitle: 'Get in touch with us for any inquiries, admissions, or donations.',
    address: 'D.No. 27-12-75, Gandikota Complex, Prakasam Road, Governorpet, Vijayawada - 520 002.',
    phone: '2577606',
    email: 'kvssvja1910@gmail.com',
    formTitle: 'Send us a Message'
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/pages/contact`);
        if (res.ok) setContent(await res.json());
      } catch (err) {}
    };
    fetchContent();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', text: 'Thank you! Your message has been sent successfully.' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ type: 'error', text: data.error || 'Failed to send message.' });
      }
    } catch (err) {
      setStatus({ type: 'error', text: 'Network error. Make sure the backend server is running.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="section" style={{ background: 'var(--color-bg)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <h2 className="section-title">{content.title}</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
            {content.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2" style={{ gap: '3rem' }}>
          <div>
            <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <FaMapMarkerAlt size={24} style={{ color: 'var(--color-primary)', marginRight: '1.5rem', marginTop: '0.2rem' }} />
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Address</h4>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {content.address}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <FaPhoneAlt size={24} style={{ color: 'var(--color-primary)', marginRight: '1.5rem', marginTop: '0.2rem' }} />
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Phone</h4>
                  <p style={{ color: 'var(--color-text-muted)' }}>{content.phone}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <FaEnvelope size={24} style={{ color: 'var(--color-primary)', marginRight: '1.5rem', marginTop: '0.2rem' }} />
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Email</h4>
                  <p style={{ color: 'var(--color-text-muted)' }}>{content.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form className="card" onSubmit={handleSubmit} style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{content.formTitle}</h3>
              
              {status.text && (
                <div style={{ 
                  padding: '1rem', 
                  borderRadius: '4px', 
                  background: status.type === 'success' ? '#d1fae5' : '#fee2e2',
                  color: status.type === 'success' ? '#065f46' : '#991b1b',
                  borderLeft: `4px solid ${status.type === 'success' ? '#10b981' : '#ef4444'}`
                }}>
                  {status.text}
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Your Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', background: 'var(--color-bg)', color: 'var(--color-text)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', background: 'var(--color-bg)', color: 'var(--color-text)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Message</label>
                <textarea rows="5" name="message" value={formData.message} onChange={handleChange} placeholder="How can we help you?" required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', resize: 'vertical', background: 'var(--color-bg)', color: 'var(--color-text)' }}></textarea>
              </div>
              <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '0.5rem', opacity: isLoading ? 0.7 : 1 }}>
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
