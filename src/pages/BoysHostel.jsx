import React, { useState } from 'react';

const generateAcademicYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 2023; i <= currentYear + 5; i++) {
    years.push(`Academic Year ${i}-${i + 1}`);
  }
  return years;
};

const BoysHostel = () => {
  const [activeTab, setActiveTab] = useState('admission');
  const [students, setStudents] = useState([]);
  const [selectedYear, setSelectedYear] = useState(() => {
    const cy = new Date().getFullYear();
    const cm = new Date().getMonth();
    const startYear = cm >= 5 ? cy : cy - 1; // Academic year usually starts in June
    return `Academic Year ${startYear}-${startYear + 1}`;
  });

  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
        const apiUrl = import.meta.env.PROD ? '' : 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/public/students`);
        if (res.ok) {
            const data = await res.json();
            setStudents(data);
        }
      } catch (err) {}
    };
    fetchStudents();
  }, []);
  const [formData, setFormData] = useState({
    studentName: '',
    dob: '',
    fatherName: '',
    contactNumber: '',
    course: '',
    address: '',
    email: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const getApiUrl = () => import.meta.env.PROD ? '' : 'http://localhost:5000';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Submitting application...' });
    
    try {
      const res = await fetch(`${getApiUrl()}/api/admissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus({ type: 'success', message: 'Application submitted successfully! We will contact you soon.' });
        setFormData({ studentName: '', dob: '', fatherName: '', contactNumber: '', course: '', address: '', email: '' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to submit application.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Network error. Please try again later.' });
    }
  };

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
            
            {status.message && (
              <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '4px', background: status.type === 'success' ? '#d1fae5' : '#fee2e2', color: status.type === 'success' ? '#065f46' : '#991b1b' }}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
              <div className="grid grid-cols-2">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600 }}>Student Full Name</label>
                  <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} required placeholder="Enter full name" style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e0' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600 }}>Date of Birth</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} required style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e0' }} />
                </div>
              </div>

              <div className="grid grid-cols-2">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600 }}>Father's Name</label>
                  <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required placeholder="Enter father's name" style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e0' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 600 }}>Contact Number</label>
                  <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required placeholder="Enter mobile number" style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e0' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600 }}>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter email address" style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e0' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600 }}>Course / Education Pursuing</label>
                <input type="text" name="course" value={formData.course} onChange={handleChange} required placeholder="e.g., B.Tech 1st Year, Degree 2nd Year" style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e0' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600 }}>Permanent Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} required rows="3" placeholder="Enter full address" style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e0', resize: 'vertical' }}></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem' }} disabled={status.type === 'loading'}>
                {status.type === 'loading' ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="card animate-fade-in" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ color: 'var(--color-primary)', margin: 0 }}>Admitted Students Directory</h3>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #cbd5e0', fontWeight: 600 }}>
                {generateAcademicYears().reverse().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                    <th style={{ padding: '1rem' }}>S.No</th>
                    <th style={{ padding: '1rem' }}>Name of the Student</th>
                    <th style={{ padding: '1rem' }}>Branch</th>
                    <th style={{ padding: '1rem' }}>Year of Study</th>
                    <th style={{ padding: '1rem' }}>College</th>
                    <th style={{ padding: '1rem' }}>Academic Year</th>
                     
                  </tr>
                </thead>
                <tbody>
                  {students.filter(s => s.academicYear === selectedYear || s.academicYear === selectedYear.replace('Academic Year ', '')).length > 0 ? (
                    students.filter(s => s.academicYear === selectedYear || s.academicYear === selectedYear.replace('Academic Year ', '')).map((item, index) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '1rem' }}>{index + 1}</td>
                        <td style={{ padding: '1rem', fontWeight: 500 }}>{item.name}</td>
                        <td style={{ padding: '1rem' }}>{item.branch || item.course}</td>
                        <td style={{ padding: '1rem' }}>{item.yearOfStudy || '-'}</td>
                        <td style={{ padding: '1rem' }}>{item.college || '-'}</td>
                        <td style={{ padding: '1rem' }}>{item.academicYear}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'gray' }}>No students found for this academic year.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--color-text-muted)' }}>
                * Showing actual enrolled student records.
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default BoysHostel;
