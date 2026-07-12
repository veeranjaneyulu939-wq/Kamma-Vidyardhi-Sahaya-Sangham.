import React, { useState } from 'react';

const BoysHostel = () => {
  const [activeTab, setActiveTab] = useState('admission');

  return (
    <section className="section" style={{ minHeight: '80vh', background: 'var(--color-bg)' }}>
      <div className="container">
        <h2 className="section-title text-center" style={{ display: 'block' }}>Boys Hostel</h2>
        
        {/* Tabs for switching between Application Form and Student Details */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <button 
            className={`btn ${activeTab === 'admission' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('admission')}
            style={{ 
              background: activeTab === 'admission' ? 'var(--color-primary)' : 'white',
              color: activeTab === 'admission' ? 'white' : 'var(--color-primary)',
              border: '2px solid var(--color-primary)'
            }}
          >
            Admission Form
          </button>
          <button 
            className={`btn ${activeTab === 'students' ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab('students')}
            style={{ 
              background: activeTab === 'students' ? 'var(--color-primary)' : 'white',
              color: activeTab === 'students' ? 'white' : 'var(--color-primary)',
              border: '2px solid var(--color-primary)'
            }}
          >
            Student Details (Yearly)
          </button>
        </div>

        {activeTab === 'admission' && (
          <div className="card animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem' }}>
            <h3 style={{ color: 'var(--color-primary)', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
              Hostel Admission Application Form
            </h3>
            
            <form style={{ display: 'grid', gap: '1.5rem' }}>
              <div className="grid grid-cols-2">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600 }}>Student Full Name</label>
                  <input type="text" placeholder="Enter full name" style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e0' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600 }}>Date of Birth</label>
                  <input type="date" style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e0' }} />
                </div>
              </div>

              <div className="grid grid-cols-2">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600 }}>Father's Name</label>
                  <input type="text" placeholder="Enter father's name" style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e0' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600 }}>Contact Number</label>
                  <input type="tel" placeholder="Enter mobile number" style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e0' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600 }}>Course / Education Pursuing</label>
                <input type="text" placeholder="e.g., B.Tech 1st Year, Degree 2nd Year" style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e0' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600 }}>Permanent Address</label>
                <textarea rows="3" placeholder="Enter full address" style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e0', resize: 'vertical' }}></textarea>
              </div>

              <button type="button" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem' }}>
                Submit Application
              </button>
            </form>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="card animate-fade-in" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ color: 'var(--color-primary)', margin: 0 }}>Admitted Students Directory</h3>
              <select style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #cbd5e0', fontWeight: 600 }}>
                <option>Academic Year 2023-2024</option>
                <option>Academic Year 2022-2023</option>
                <option>Academic Year 2021-2022</option>
              </select>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                    <th style={{ padding: '1rem' }}>S.No</th>
                    <th style={{ padding: '1rem' }}>Student Name</th>
                    <th style={{ padding: '1rem' }}>Course</th>
                    <th style={{ padding: '1rem' }}>Native Place</th>
                    <th style={{ padding: '1rem' }}>Room No</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem' }}>{item}</td>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>Example Student {item}</td>
                      <td style={{ padding: '1rem' }}>B.Tech</td>
                      <td style={{ padding: '1rem' }}>Guntur</td>
                      <td style={{ padding: '1rem' }}>10{item}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--color-text-muted)' }}>
                * This data is a placeholder and will be populated from the database.
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default BoysHostel;
