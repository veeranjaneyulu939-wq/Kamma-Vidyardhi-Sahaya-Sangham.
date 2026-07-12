import React from 'react';
import { FaWifi, FaUtensils, FaDumbbell, FaBookOpen, FaBroom, FaVideo } from 'react-icons/fa';

const FacilitiesSection = () => {
  const facilities = [
    { icon: <FaUtensils size={40} />, title: 'Hygienic Mess', desc: 'Nutritious and delicious meals served three times a day in a clean dining hall.' },
    { icon: <FaWifi size={40} />, title: 'High-Speed Wi-Fi', desc: 'Uninterrupted 24/7 internet connectivity for your study needs.' },
    { icon: <FaBookOpen size={40} />, title: 'Study Rooms', desc: 'Quiet, well-lit study halls for focused preparation and group discussions.' },
    { icon: <FaVideo size={40} />, title: '24/7 Security', desc: 'CCTV surveillance and round-the-clock security guards for safety.' },
    { icon: <FaBroom size={40} />, title: 'Housekeeping', desc: 'Daily cleaning of rooms and common areas to maintain hygiene.' },
    { icon: <FaDumbbell size={40} />, title: 'Gym & Sports', desc: 'Equipped fitness center and indoor games for physical well-being.' }
  ];

  return (
    <section id="facilities" className="section" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container">
        <div className="text-center">
          <h2 className="section-title">సదుపాయాలు (Facilities)</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-text-muted)' }}>
            We offer premium amenities to ensure that every student's stay is comfortable, secure, and productive.
          </p>
        </div>

        <div className="grid grid-cols-3" style={{ marginTop: '4rem' }}>
          {facilities.map((fac, idx) => (
            <div key={idx} className="card" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '2.5rem 2rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: 'rgba(212, 175, 55, 0.1)', // Light gold
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                transition: 'var(--transition)'
              }} className="icon-container">
                {fac.icon}
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>{fac.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{fac.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .card:hover .icon-container {
          background-color: var(--color-accent);
          color: white;
          transform: scale(1.1);
        }
      `}</style>
    </section>
  );
};

export default FacilitiesSection;
