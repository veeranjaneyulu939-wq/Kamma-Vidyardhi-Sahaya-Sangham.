import React, { useState, useEffect } from 'react';
import { auth, db, storage, signOut as firebaseSignOut } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';

const generateAcademicYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 2023; i <= currentYear + 5; i++) {
    years.push(`Academic Year ${i}-${i + 1}`);
  }
  return years;
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState('messages');
  
  // Students state
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentForm, setStudentForm] = useState({ name: '', course: '', contactNumber: '', academicYear: '', branch: '', yearOfStudy: '', college: '' });
  const [selectedYearFilter, setSelectedYearFilter] = useState('All');

  // Admissions state
  const [admissions, setAdmissions] = useState([]);
  const [admissionsLoading, setAdmissionsLoading] = useState(true);
  
  // Messages state
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  
  // Events state
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventForm, setEventForm] = useState({ title: '', date: '', location: '', description: '', image: '' });
  
  // Pages state
  const [selectedPage, setSelectedPage] = useState('');
  const [pageData, setPageData] = useState(null);

  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const ALLOWED_EMAILS = ['kvssgnt1930@gmail.com', 'kvssgnt@gmail.com', 'kvssvja1910@gmail.com', 'superadmin@kammahostel.com', 'kammahostelgnt1930@gmail.com', 'kammahostel1930@gnt.com'];
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      } else if (!ALLOWED_EMAILS.includes(user.email)) {
        firebaseSignOut(auth).then(() => {
          navigate('/login');
        });
      } else {
        fetchMessages();
        fetchAdmissions();
        fetchStudents();
        fetchEvents();
      }
    });
    return () => unsubscribe();
  }, [navigate]);


  const handleUpdateAdmissionStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'admissions', id), { status });
      fetchAdmissions();
    } catch (err) { console.error(err); }
  };

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'students'));
      const data = [];
      querySnapshot.forEach(doc => data.push({id: doc.id, ...doc.data()}));
      setStudents(data);
    } catch (err) { setError('Failed to load students.'); }
    finally { setStudentsLoading(false); }
  };
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addDoc(collection(db, 'students'), studentForm);
      setStudentForm({ name: '', course: '', contactNumber: '', academicYear: '', branch: '', yearOfStudy: '', college: '' });
      fetchStudents();
    } catch (err) { setError('Failed to add student.'); }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteDoc(doc(db, 'students', id));
      fetchStudents();
    } catch (err) { setError('Failed to delete student.'); }
  };

  const handleDeleteAdmission = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteDoc(doc(db, 'admissions', id));
      fetchAdmissions();
    } catch (err) { setError('Failed to delete admission.'); }
  };

  const fetchAdmissions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'admissions'));
      const data = [];
      querySnapshot.forEach(doc => data.push({id: doc.id, ...doc.data()}));
      setAdmissions(data);
    } catch (err) { setError('Failed to load admissions.'); }
    finally { setAdmissionsLoading(false); }
  };
  const fetchMessages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'messages'));
      const data = [];
      querySnapshot.forEach(doc => data.push({id: doc.id, ...doc.data()}));
      setMessages(data);
    } catch (err) { setError('Failed to load messages.'); }
    finally { setMessagesLoading(false); }
  };
  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'events'));
      const data = [];
      querySnapshot.forEach(doc => data.push({id: doc.id, ...doc.data()}));
      setEvents(data);
    } catch (err) { setError('Failed to load events.'); }
    finally { setEventsLoading(false); }
  };
  const getDefaultPageData = (pageName) => {
    switch(pageName) {
      case 'home': return { title: 'Welcome to Kamma Vidyarthi Sahaya Sangham', subtitle: 'A Home Away From Home', description: '' };
      case 'history': return { title: 'Our History', subtitle: 'A century of serving students', timeline: [{ year: '1930', event: 'Founded' }] };
      case 'past-presidents': return { title: 'Past Presidents & Secretaries', subtitle: 'Our esteemed leaders', profiles: [] };
      case 'founders': return { title: 'Our Founders', subtitle: 'The visionaries', profiles: [] };
      case 'governing-body': return { title: 'Governing Body', subtitle: 'Guiding the sangham', profiles: [] };
      case 'management-committee': return { title: 'Management Committee', subtitle: 'Managing daily operations', profiles: [] };
      case 'hostel': return { title: 'Boys Hostel', subtitle: 'Facilities and information', description: '', facilities: [] };
      case 'donate': return { title: 'Make a Donation', subtitle: 'Support our cause', description: '', bankDetails: '', upiId: '' };
      case 'gallery': return { title: 'Photo Gallery', subtitle: 'Memories and events', images: [] };
      case 'contact': return { title: 'Contact Us', subtitle: 'Get in touch', address: '', phone1: '', phone2: '', email: '' };
      default: return {};
    }
  };

  const loadPageContent = async (pageName) => {
    setError('');
    try {
      const docSnap = await getDoc(doc(db, 'pages', pageName));
      if (docSnap.exists()) {
        setPageData(JSON.parse(docSnap.data().content));
      } else {
        setPageData(getDefaultPageData(pageName)); 
      }
      setSelectedPage(pageName);
    } catch(err) { setError("Failed to load page content"); }
  };

  const handleSavePageContent = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'pages', selectedPage), {
        page_name: selectedPage,
        content: JSON.stringify(pageData)
      });
      alert('Saved successfully!');
    } catch(err) { setError("Failed to save.") }
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const storageRef = ref(storage, 'uploads/' + Date.now() + '_' + file.name);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setPageData({...pageData, images: [...(pageData.images || []), url]});
    } catch(err) { setError("Network error during upload"); }
  };

  const handleRemovePhoto = (index) => {
      const newImages = [...pageData.images];
      newImages.splice(index, 1);
      setPageData({...pageData, images: newImages});
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addDoc(collection(db, 'events'), eventForm);
      setEventForm({ title: '', date: '', location: '', description: '', image: '' });
      fetchEvents();
    } catch (err) { setError('Failed to add event.'); }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteDoc(doc(db, 'events', id));
      fetchEvents();
    } catch (err) { setError('Failed to delete event.'); }
  };

  

  const handleLogout = async () => {
      localStorage.removeItem('adminBypass');
      await firebaseSignOut(auth);
      navigate('/login');
  };

  return (
    <div className="section" style={{ background: 'var(--color-bg)', minHeight: '80vh' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Admin Dashboard</h2>
          <button onClick={handleLogout} className="btn" style={{ background: '#ef4444', color: 'white' }}>Logout</button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setActiveTab('messages')}
            className="btn" 
            style={{ background: activeTab === 'messages' ? 'var(--color-primary)' : '#cbd5e0', color: activeTab === 'messages' ? 'white' : '#4a5568' }}
          >
            Contact Messages
          </button>
          <button 
            onClick={() => setActiveTab('admissions')}
            className="btn" 
            style={{ background: activeTab === 'admissions' ? 'var(--color-primary)' : '#cbd5e0', color: activeTab === 'admissions' ? 'white' : '#4a5568' }}
          >
            Admissions
          </button>
          <button 
            onClick={() => setActiveTab('students')}
            className="btn" 
            style={{ background: activeTab === 'students' ? 'var(--color-primary)' : '#cbd5e0', color: activeTab === 'students' ? 'white' : '#4a5568' }}
          >
            Students (Yearly)
          </button>
          <button 
            onClick={() => setActiveTab('events')}
            className="btn" 
            style={{ background: activeTab === 'events' ? 'var(--color-primary)' : '#cbd5e0', color: activeTab === 'events' ? 'white' : '#4a5568' }}
          >
            Manage Events
          </button>
          <button 
            onClick={() => setActiveTab('pages')}
            className="btn" 
            style={{ background: activeTab === 'pages' ? 'var(--color-primary)' : '#cbd5e0', color: activeTab === 'pages' ? 'white' : '#4a5568' }}
          >
            Manage Page Text
          </button>
        </div>

        {error && (
            <div style={{ color: 'red', padding: '1rem', background: '#fee2e2', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>
        )}
        
        {activeTab === 'admissions' && (
            <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Hostel Admissions</h3>
            {admissionsLoading ? <p>Loading...</p> : admissions.length === 0 ? <p>No admission forms submitted yet.</p> : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-surface)' }}>
                      <th style={{ padding: '1rem' }}>Date</th>
                      <th style={{ padding: '1rem' }}>Student Name</th>
                      <th style={{ padding: '1rem' }}>DOB</th>
                      <th style={{ padding: '1rem' }}>Father's Name</th>
                      <th style={{ padding: '1rem' }}>Contact</th>
                      <th style={{ padding: '1rem' }}>Course</th>
                      <th style={{ padding: '1rem' }}>Address</th>
                      <th style={{ padding: '1rem' }}>Status</th>
                      <th style={{ padding: '1rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admissions.map((adm) => (
                      <tr key={adm.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '1rem' }}>{new Date(adm.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: '1rem', fontWeight: 600 }}>{adm.studentName}</td>
                        <td style={{ padding: '1rem' }}>{adm.dob}</td>
                        <td style={{ padding: '1rem' }}>{adm.fatherName}</td>
                        <td style={{ padding: '1rem' }}>{adm.contactNumber}</td>
                        <td style={{ padding: '1rem' }}>{adm.course}</td>
                        <td style={{ padding: '1rem' }}>{adm.address}</td>
                        <td style={{ padding: '1rem', fontWeight: 600, color: adm.status === 'Accepted' ? '#10b981' : adm.status === 'Rejected' ? '#ef4444' : '#f59e0b' }}>{adm.status}</td>
                        <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => {
                              handleUpdateAdmissionStatus(adm.id, 'Accepted');
                              window.location.href = `mailto:${adm.email}?subject=Hostel Admission Accepted&body=Hi ${adm.studentName},%0A%0AWe are pleased to inform you that your application for Kamma Vidyarthi Sahaya Sangam Boys Hostel has been accepted!%0A%0APlease contact us for further joining details.%0A%0ABest regards,%0AAdmin`;
                            }}
                            className="btn" 
                            style={{ background: '#10b981', color: 'white', padding: '0.5rem', fontSize: '0.8rem' }}>
                            Accept
                          </button>
                          <button 
                            onClick={() => handleDeleteAdmission(adm.id)}
                            className="btn" 
                            style={{ background: '#64748b', color: 'white', padding: '0.5rem', fontSize: '0.8rem' }}>
                            Delete
                          </button>
                          <button 
                            onClick={() => {
                              handleUpdateAdmissionStatus(adm.id, 'Rejected');
                              window.location.href = `mailto:${adm.email}?subject=Hostel Admission Update&body=Hi ${adm.studentName},%0A%0AWe regret to inform you that we are unable to accept your application for the hostel at this time due to limited availability.%0A%0AWe wish you the best.%0A%0ABest regards,%0AAdmin`;
                            }}
                            className="btn" 
                            style={{ background: '#ef4444', color: 'white', padding: '0.5rem', fontSize: '0.8rem' }}>
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
            <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Contact Us Messages</h3>
            {messagesLoading ? <p>Loading...</p> : messages.length === 0 ? <p>No messages.</p> : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-surface)' }}>
                      <th style={{ padding: '1rem' }}>Date</th>
                      <th style={{ padding: '1rem' }}>Name</th>
                      <th style={{ padding: '1rem' }}>Email</th>
                      <th style={{ padding: '1rem' }}>Message</th>
                      <th style={{ padding: '1rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((msg) => (
                      <tr key={msg.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '1rem' }}>{new Date(msg.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: '1rem', fontWeight: 600 }}>{msg.name}</td>
                        <td style={{ padding: '1rem' }}>{msg.email}</td>
                        <td style={{ padding: '1rem' }}>{msg.message}</td>
                        <td style={{ padding: '1rem' }}>
                          <a href={`mailto:${msg.email}?subject=Reply from Kamma Hostel&body=Hi ${msg.name},%0A%0A`} style={{ display: 'inline-block', background: 'var(--color-primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem' }}>Reply</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'students' && (
            <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Add Enrolled Student</h3>
              <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="text" placeholder="Student Name" required value={studentForm.name} onChange={e => setStudentForm({...studentForm, name: e.target.value})} style={{ padding: '0.75rem', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="text" placeholder="Course" required value={studentForm.course} onChange={e => setStudentForm({...studentForm, course: e.target.value})} style={{ padding: '0.75rem', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="text" placeholder="Branch" value={studentForm.branch} onChange={e => setStudentForm({...studentForm, branch: e.target.value})} style={{ padding: '0.75rem', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="text" placeholder="Year of Study" value={studentForm.yearOfStudy} onChange={e => setStudentForm({...studentForm, yearOfStudy: e.target.value})} style={{ padding: '0.75rem', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="text" placeholder="College" value={studentForm.college} onChange={e => setStudentForm({...studentForm, college: e.target.value})} style={{ padding: '0.75rem', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="text" placeholder="Contact Number" value={studentForm.contactNumber} onChange={e => setStudentForm({...studentForm, contactNumber: e.target.value})} style={{ padding: '0.75rem', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }} />
                <select required value={studentForm.academicYear} onChange={e => setStudentForm({...studentForm, academicYear: e.target.value})} style={{ padding: '0.75rem', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="" disabled>Select Academic Year</option>
                  {generateAcademicYears().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <button type="submit" className="btn btn-primary">Add Student</button>
              </form>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-primary)' }}>Student Records</h3>
                <select value={selectedYearFilter} onChange={e => setSelectedYearFilter(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="All">All Years</option>
                  {generateAcademicYears().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              {studentsLoading ? <p>Loading...</p> : students.length === 0 ? <p>No students found.</p> : (
                <div style={{ overflowY: 'auto', maxHeight: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {students.filter(s => selectedYearFilter === 'All' || s.academicYear === selectedYearFilter || s.academicYear === selectedYearFilter.replace('Academic Year ', '')).map(st => (
                    <div key={st.id} style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.2rem 0' }}>{st.name}</h4>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'gray' }}>{st.course} | {st.academicYear} | {st.contactNumber}</p>
                      </div>
                      <button onClick={() => handleDeleteStudent(st.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}>Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
            <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Add New Event</h3>
              <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="text" placeholder="Event Title" required value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} style={{ padding: '0.75rem', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="text" placeholder="Date (e.g., Aug 15, 2026)" required value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} style={{ padding: '0.75rem', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="text" placeholder="Location" required value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} style={{ padding: '0.75rem', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }} />
                <textarea placeholder="Description" rows="4" required value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} style={{ padding: '0.75rem', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}></textarea>
                
                <div style={{ padding: '1rem', border: '1px dashed #ccc', borderRadius: '4px' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>Event Photo (Optional)</p>
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files[0];
                    if(!file) return;
                    try {
                      const storageRef = ref(storage, 'events/' + Date.now() + '_' + file.name);
                      await uploadBytes(storageRef, file);
                      const url = await getDownloadURL(storageRef);
                      setEventForm({...eventForm, image: url});
                    } catch(err) { console.error('Upload failed:', err); }
                  }} />
                  {eventForm.image && <img src={eventForm.image} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '1rem', borderRadius: '8px' }} />}
                </div>

                <button type="submit" className="btn btn-primary">Add Event</button>
              </form>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Existing Events</h3>
              {eventsLoading ? <p>Loading...</p> : events.length === 0 ? <p>No events found.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {events.map(ev => (
                    <div key={ev.id} style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {ev.image && <img src={ev.image} alt="Event" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />}
                        <div>
                          <h4 style={{ margin: '0 0 0.2rem 0' }}>{ev.title}</h4>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: 'gray' }}>{ev.date} | {ev.location}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteEvent(ev.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><FaTrashAlt /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'pages' && (
            <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Edit Page Text Content</h3>
                <select onChange={(e) => { if(e.target.value) loadPageContent(e.target.value) }} defaultValue="" style={{ padding: '0.75rem', width: '100%', maxWidth: '400px', borderRadius: '4px', border: '1px solid #ccc' }}>
                    <option value="" disabled>Select a page to edit</option>
                    <option value="home">Home Page</option>
                    <option value="history">History Page</option>
                    <option value="past-presidents">Past Presidents & Secs</option>
                    <option value="founders">Founders</option>
                    <option value="governing-body">Governing Body</option>
                    <option value="management-committee">Management Committee</option>
                    <option value="hostel">Boys Hostel Page</option>
                    <option value="donate">Donate Page</option>
                    <option value="gallery">Gallery Page</option>
                    <option value="contact">Contact Page</option>
                </select>
                
                {pageData && (
                    <form onSubmit={handleSavePageContent} style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {Object.keys(pageData).map(key => {
                            const val = pageData[key];
                            if (selectedPage === 'gallery' && key === 'images') {
                                return (
                                    <div key={key} style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
                                        <label style={{fontWeight: 600, display: 'block', marginBottom: '1rem', fontSize: '1.2rem', color: 'var(--color-primary)'}}>Gallery Photos</label>
                                        
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                            {val && val.map((img, idx) => (
                                                <div key={idx} style={{ position: 'relative', width: '150px', height: '150px' }}>
                                                    <img src={img} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                                    <button type="button" onClick={() => handleRemovePhoto(idx)} style={{ position: 'absolute', top: '5px', right: '5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer' }}>&times;</button>
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '4px', border: '1px dashed #ccc' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Upload New Photo</label>
                                            <input type="file" accept="image/*" onChange={handleUploadPhoto} />
                                        </div>
                                    </div>
                                )
                            }
                            if (key === 'profiles') {
                                return (
                                    <div key={key} style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
                                        <label style={{fontWeight: 600, display: 'block', marginBottom: '1rem', fontSize: '1.2rem', color: 'var(--color-primary)'}}>Manage Profiles</label>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                                            {val && val.map((profile, idx) => (
                                                <div key={idx} style={{ position: 'relative', border: '1px solid #ccc', padding: '1rem', borderRadius: '4px', display: 'flex', gap: '1rem' }}>
                                                    <div style={{ width: '120px', flexShrink: 0 }}>
                                                        <img src={profile.image || 'https://via.placeholder.com/120'} alt="Profile" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.5rem', border: '1px solid #ddd' }} />
                                                        <input type="file" accept="image/*" onChange={async (e) => {
                                                            const file = e.target.files[0];
                                                            if (!file) return;
                                                            try {
                                                                const storageRef = ref(storage, 'profiles/' + Date.now() + '_' + file.name);
                                                                await uploadBytes(storageRef, file);
                                                                const url = await getDownloadURL(storageRef);
                                                                const newProfiles = [...pageData.profiles];
                                                                newProfiles[idx].image = url;
                                                                setPageData({...pageData, profiles: newProfiles});
                                                            } catch(err) { console.error('Upload failed:', err); }
                                                        }} style={{ width: '100%', fontSize: '0.75rem' }} />
                                                    </div>
                                                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                        <input type="text" placeholder="Name" value={profile.name} onChange={e => {
                                                            const newProfiles = [...pageData.profiles];
                                                            newProfiles[idx].name = e.target.value;
                                                            setPageData({...pageData, profiles: newProfiles});
                                                        }} style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                                                        <input type="text" placeholder="Role / Title" value={profile.role} onChange={e => {
                                                            const newProfiles = [...pageData.profiles];
                                                            newProfiles[idx].role = e.target.value;
                                                            setPageData({...pageData, profiles: newProfiles});
                                                        }} style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                                                        <textarea placeholder="Biography" rows="3" value={profile.bio} onChange={e => {
                                                            const newProfiles = [...pageData.profiles];
                                                            newProfiles[idx].bio = e.target.value;
                                                            setPageData({...pageData, profiles: newProfiles});
                                                        }} style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                                                    </div>
                                                    <button type="button" onClick={() => {
                                                        if(!window.confirm('Delete this profile?')) return;
                                                        const newProfiles = [...pageData.profiles];
                                                        newProfiles.splice(idx, 1);
                                                        setPageData({...pageData, profiles: newProfiles});
                                                    }} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem', cursor: 'pointer', alignSelf: 'flex-start', borderRadius: '4px' }}>Remove</button>
                                                </div>
                                            ))}
                                        </div>

                                        <button type="button" className="btn" style={{ background: '#10b981', color: 'white' }} onClick={() => {
                                            setPageData({...pageData, profiles: [...(pageData.profiles || []), { name: '', role: '', bio: '', image: '' }]});
                                        }}>+ Add Profile</button>
                                    </div>
                                )
                            }
                            if (key === 'timeline') {
                                return (
                                    <div key={key} style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
                                        <label style={{fontWeight: 600, display: 'block', marginBottom: '1rem', fontSize: '1.2rem', color: 'var(--color-primary)'}}>Manage History Timeline</label>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                                            {val && val.map((item, idx) => (
                                                <div key={idx} style={{ position: 'relative', border: '1px solid #ccc', padding: '1rem', borderRadius: '4px', display: 'flex', gap: '1rem' }}>
                                                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                        <input type="text" placeholder="Year (e.g. 1910)" value={item.year} onChange={e => {
                                                            const newTimeline = [...pageData.timeline];
                                                            newTimeline[idx].year = e.target.value;
                                                            setPageData({...pageData, timeline: newTimeline});
                                                        }} style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontWeight: 'bold' }} />
                                                        <textarea placeholder="Event Description" rows="3" value={item.event} onChange={e => {
                                                            const newTimeline = [...pageData.timeline];
                                                            newTimeline[idx].event = e.target.value;
                                                            setPageData({...pageData, timeline: newTimeline});
                                                        }} style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                                                    </div>
                                                    <button type="button" onClick={() => {
                                                        if(!window.confirm('Delete this timeline event?')) return;
                                                        const newTimeline = [...pageData.timeline];
                                                        newTimeline.splice(idx, 1);
                                                        setPageData({...pageData, timeline: newTimeline});
                                                    }} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem', cursor: 'pointer', alignSelf: 'flex-start', borderRadius: '4px' }}>Remove</button>
                                                </div>
                                            ))}
                                        </div>

                                        <button type="button" className="btn" style={{ background: '#10b981', color: 'white' }} onClick={() => {
                                            setPageData({...pageData, timeline: [...(pageData.timeline || []), { year: '', event: '' }]});
                                        }}>+ Add Timeline Event</button>
                                    </div>
                                )
                            }
                            if (typeof val === 'string') {
                                return (
                                    <div key={key}>
                                        <label style={{fontWeight: 600, display: 'block', marginBottom: '0.5rem', textTransform: 'capitalize'}}>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                                        {val.length > 80 ? (
                                            <textarea value={val} onChange={e => setPageData({...pageData, [key]: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc'}} rows="5" />
                                        ) : (
                                            <input type="text" value={val} onChange={e => setPageData({...pageData, [key]: e.target.value})} style={{width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc'}} />
                                        )}
                                    </div>
                                )
                            } else {
                                // arrays/objects
                                return (
                                    <div key={key}>
                                        <label style={{fontWeight: 600, display: 'block', marginBottom: '0.5rem', textTransform: 'capitalize'}}>{key.replace(/([A-Z])/g, ' $1').trim()} (List Format)</label>
                                        <textarea value={JSON.stringify(val, null, 2)} onChange={e => {
                                            try {
                                                const newVal = JSON.parse(e.target.value);
                                                setPageData({...pageData, [key]: newVal});
                                            } catch(err) {
                                                // ignore parse errors while typing
                                            }
                                        }} style={{width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'monospace'}} rows="10" />
                                        <small style={{color: 'gray'}}>Edit carefully! This is formatted as raw data.</small>
                                    </div>
                                )
                            }
                        })}
                        <button type="submit" className="btn btn-primary" style={{marginTop: '1rem', alignSelf: 'flex-start', padding: '0.75rem 2rem'}}>Save Page Changes</button>
                    </form>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
