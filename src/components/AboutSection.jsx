import React, { useState, useEffect } from 'react';
import { FaUserGraduate, FaShieldAlt, FaBed } from 'react-icons/fa';

const AboutSection = () => {
  const [content, setContent] = useState({
    welcomeTitle: 'Welcome to Kamma Vidyarthi Sahaya Sangam',
    welcomeSubtitle: 'Established with a noble vision to support the educational journey of young minds, our hostel provides a nurturing environment that feels just like home. We believe that a comfortable stay is fundamental to academic success.',
    aboutTitle: 'మా గురించి (About Us)',
    aboutText: 'With state-of-the-art facilities, hygienic food, and strict security, we ensure that parents can have peace of mind while their children focus on building a bright future.'
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/pages/home`);
        if (res.ok) {
          const data = await res.json();
          setContent(data);
        }
      } catch (err) {}
    };
    fetchContent();
  }, []);

  const stats = [
    { icon: <FaUserGraduate size={30} />, count: "500+", label: "Happy Students" },
    { icon: <FaBed size={30} />, count: "120", label: "Rooms" },
    { icon: <FaShieldAlt size={30} />, count: "24/7", label: "Security" },
  ];

  return (
    <section id="about" className="section" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="container">
        <div className="text-center">
          <h2 className="section-title">{content.aboutTitle || 'మా గురించి (About Us)'}</h2>
        </div>
        
        <div className="grid grid-cols-2" style={{ alignItems: 'center', marginTop: '3rem' }}>
          <div style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>{content.welcomeTitle}</h3>
            <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
              {content.welcomeSubtitle}
            </p>
            <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
              {content.aboutText}
            </p>
            <button className="btn btn-primary" style={{ marginTop: '2rem' }}>Read Our History</button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {stats.map((stat, idx) => (
              <div key={idx} className="card text-center" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '2rem',
                borderTop: `4px solid var(--color-accent)`
              }}>
                <div style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
                  {stat.icon}
                </div>
                <h4 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-primary)' }}>{stat.count}</h4>
                <p style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{stat.label}</p>
              </div>
            ))}
            {/* Image card */}
            <div className="card" style={{ 
              padding: 0, 
              overflow: 'hidden', 
              background: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h4 className="font-telugu" style={{ fontSize: '1.8rem', color: 'var(--color-accent)', margin: 0 }}>విద్యాదానం</h4>
                <p style={{ margin: 0, opacity: 0.9 }}>Empowering Education</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
