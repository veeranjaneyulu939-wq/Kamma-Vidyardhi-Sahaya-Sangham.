import React, { useState, useEffect } from 'react';

const History = () => {
  const [content, setContent] = useState({
    title: 'Our Glorious History',
    subtitle: 'Over a Century of Service to Students',
    timeline: [
      { year: '1910', event: 'The inception of Kamma Vidyarthi Sahaya Sangam with a vision to support students in need.' },
      { year: '1945', event: 'Expanded facilities to accommodate more students and introduced new academic support programs.' },
      { year: '1980', event: 'Modernized the hostel infrastructure, adding better amenities for a comfortable stay.' },
      { year: '2010', event: 'Celebrated the Centenary year, marking 100 years of unwavering commitment to student welfare.' },
      { year: '2023', event: 'Completed major renovations and introduced digital learning resources in the library.' }
    ]
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const apiUrl = import.meta.env.PROD ? '' : 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/pages/history`);
        if (res.ok) {
            const data = await res.json();
            setContent(data);
        }
      } catch (err) {}
    };
    fetchContent();
  }, []);

  return (
    <div className="section" style={{ background: 'var(--color-bg)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <h2 className="section-title">{content.title}</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem' }}>{content.subtitle}</p>
        </div>
        
        <div style={{ width: '100%', margin: '0 auto', position: 'relative' }}>
          {/* Vertical Line */}
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '100%', background: 'var(--color-accent)', borderRadius: '2px' }}></div>
          
          {content.timeline && content.timeline.map((item, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
              marginBottom: '3rem',
              position: 'relative',
              width: '100%'
            }}>
              <div style={{ width: '45%' }}>
                <div className="card" style={{ padding: '2rem', position: 'relative', transition: 'var(--transition)' }} 
                     onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                     onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
                  <h3 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '0.5rem', fontFamily: 'serif' }}>{item.year}</h3>
                  <p style={{ color: 'var(--color-text)', lineHeight: 1.6 }}>{item.event}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
