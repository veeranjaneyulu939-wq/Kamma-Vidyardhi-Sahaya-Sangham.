import React, { useState, useEffect } from 'react';

const PastPresidents = () => {
  const [content, setContent] = useState({
    title: 'Past Presidents & Secretaries',
    subtitle: 'Honoring those who led us through the years.',
    content: 'This page is dedicated to the past presidents and secretaries who have selflessly served the Kamma Vidyarthi Sahaya Sangam.'
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/pages/past-presidents`);
        if (res.ok) setContent(await res.json());
      } catch (err) {}
    };
    fetchContent();
  }, []);

  return (
    <div className="section" style={{ background: 'var(--color-bg)', minHeight: '60vh' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <h2 className="section-title">{content.title}</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
            {content.subtitle}
          </p>
        </div>
        {content.content && (
          <div className="card" style={{ padding: '3rem', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
            <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{content.content}</p>
          </div>
        )}

        {content.profiles && content.profiles.length > 0 && (
          <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
            {content.profiles.map((person, idx) => (
              <div key={idx} className="card text-center" style={{ padding: '2rem', transition: 'transform 0.2s', borderTop: '4px solid var(--color-primary)' }}
                   onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                   onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <img src={person.image || 'https://via.placeholder.com/150'} alt={person.name} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem auto', border: '3px solid #eee' }} />
                <h3 style={{ color: 'var(--color-primary)', fontSize: '1.4rem', marginBottom: '0.2rem' }}>{person.name}</h3>
                <p style={{ color: 'var(--color-text)', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>{person.role}</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{person.bio}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PastPresidents;
