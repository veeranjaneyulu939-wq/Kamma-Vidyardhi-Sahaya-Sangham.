import React, { useState, useEffect } from 'react';
import AboutSection from '../components/AboutSection';
import { FaUserTie, FaTimes } from 'react-icons/fa';

const Home = () => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [management, setManagement] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/pages/home`);
        if (res.ok) {
            const data = await res.json();
            if (data.profiles) setManagement(data.profiles);
        }
      } catch (err) {}
    };
    fetchContent();
  }, []);

  return (
    <div>
      <AboutSection />
      
      {/* Management Committee Section */}
      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">మేనేజింగ్ కమిటీ (Management Committee)</h2>
          </div>
          
          <div className="grid grid-cols-3" style={{ marginTop: '3rem', gap: '2rem' }}>
            {management.map((person, idx) => (
              <div 
                key={idx} 
                className="card text-center" 
                style={{ padding: '3rem 2rem', borderTop: '4px solid var(--color-primary)', cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', height: '100%' }}
                onClick={() => setSelectedPerson(person)}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ 
                  width: '120px', height: '120px', borderRadius: '50%', 
                  background: 'var(--color-bg)', margin: '0 auto 1.5rem auto',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-primary)', overflow: 'hidden', border: '3px solid var(--color-surface)'
                }}>
                  {person.image ? (
                    <img src={person.image} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <FaUserTie size={50} />
                  )}
                </div>
                <h3 style={{ color: 'var(--color-primary)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>{person.role}</h3>
                <p style={{ color: 'var(--color-text)', fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>{person.name}</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6, flexGrow: 1 }}>
                  {person.bio && person.bio.length > 100 ? person.bio.substring(0, 100) + '...' : person.bio}
                </p>
                <button className="btn btn-outline" style={{ marginTop: 'auto', padding: '0.5rem 1rem', fontSize: '0.9rem', alignSelf: 'center' }}>Read More</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Biography Modal */}
      {selectedPerson && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem'
        }} onClick={() => setSelectedPerson(null)}>
          <div style={{
            background: 'var(--color-bg)', width: '100%', maxWidth: '700px',
            maxHeight: '90vh', overflowY: 'auto', borderRadius: '12px',
            padding: '2rem', position: 'relative', borderTop: '5px solid var(--color-primary)'
          }} onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedPerson(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)', fontSize: '1.5rem' }}
            >
              <FaTimes />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-primary)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee', color: 'var(--color-primary)' }}>
                {selectedPerson.image ? (
                  <img src={selectedPerson.image} alt={selectedPerson.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <FaUserTie size={30} />
                )}
              </div>
              <div>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary)', marginBottom: '0.2rem' }}>{selectedPerson.name}</h2>
                <h4 style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>{selectedPerson.role}</h4>
              </div>
            </div>

            <div style={{ color: 'var(--color-text)' }}>
              {selectedPerson.fullBio ? selectedPerson.fullBio.map((section, idx) => (
                <div key={idx} style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '0.5rem', borderLeft: '3px solid var(--color-primary)', paddingLeft: '0.5rem' }}>{section.heading}</h4>
                  <p style={{ lineHeight: 1.7, fontSize: '1.05rem', color: 'var(--color-text-muted)' }}>{section.content}</p>
                </div>
              )) : (
                <p style={{ lineHeight: 1.7, fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>{selectedPerson.bio}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
