import React from 'react';

const HeroSection = () => {
  return (
    <section id="home" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(to right, rgba(26, 54, 93, 0.9), rgba(44, 82, 130, 0.7))',
      color: 'white',
      textAlign: 'center',
      padding: '0 1.5rem'
    }}>
      {/* Background Image Placeholder */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url("/building_bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: -1,
        opacity: 0.5
      }} />

      <div className="container animate-fade-in" style={{ zIndex: 1 }}>
        <h1 className="font-telugu" style={{ 
          fontSize: 'clamp(3rem, 6vw, 5rem)', 
          color: 'var(--color-accent)',
          marginBottom: '1rem',
          textShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}>
          కమ్మ విద్యార్థి సహాయ సంఘం
        </h1>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
          fontWeight: 300,
          marginBottom: '2rem',
          color: '#f7fafc'
        }}>
          A Home Away From Home
        </h2>
        <p style={{
          maxWidth: '600px',
          margin: '0 auto 3rem auto',
          fontSize: '1.1rem',
          opacity: 0.9,
          lineHeight: 1.8
        }}>
          Providing a safe, comfortable, and supportive environment for students to achieve their academic goals. Excellence in accommodation and community living.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-accent" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Book a Room
          </button>
          <button className="btn" style={{ 
            background: 'transparent', 
            border: '2px solid white', 
            color: 'white',
            padding: '1rem 2rem', 
            fontSize: '1.1rem' 
          }}
          onMouseOver={(e) => { e.target.style.background = 'white'; e.target.style.color = 'var(--color-primary)'; }}
          onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'white'; }}
          >
            Explore Facilities
          </button>
        </div>
      </div>
      
      {/* Scroll Down Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        animation: 'bounce 2s infinite'
      }}>
        <div style={{
          width: '30px',
          height: '50px',
          border: '2px solid white',
          borderRadius: '15px',
          display: 'flex',
          justifyContent: 'center',
          padding: '5px'
        }}>
          <div style={{
            width: '4px',
            height: '10px',
            backgroundColor: 'var(--color-accent)',
            borderRadius: '2px'
          }} />
        </div>
      </div>
      
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
          40% { transform: translateY(-20px) translateX(-50%); }
          60% { transform: translateY(-10px) translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
