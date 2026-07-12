import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="header-container">
      {/* Red Banner Section */}
      <div className="red-banner">
        <div className="container banner-content">
          <div className="logo-container">
            <img src="/logo.png" alt="Sangam Logo" className="logo-image" />
          </div>
          
          <div className="text-container">
            <div className="top-meta">
              <span className="font-telugu">స్థాపితం : 1930</span>
              <span className="font-telugu">రిజిస్టర్డు నెం. 14/1975</span>
            </div>
            
            <h1 className="title-english">Kamma Vidyardhi Sahaya Sangham</h1>
            <h2 className="title-telugu font-telugu">కమ్మ విద్యార్థి సహాయ సంఘం</h2>
            
            <div className="address-container">
              సాలిపేట, 4/4 అరండల్ పేట, గుంటూరు, 522001. ఫోన్ : 2577606<br />
              Email : kvssgnt1930@gmail.com
            </div>
          </div>
        </div>
      </div>

      {/* White Navigation Bar */}
      <nav className="white-nav">
        <div className="container nav-links">
          <Link to="/">HOME</Link>
          <div className="nav-dropdown">
            <Link to="/about" className="dropbtn">ABOUT US</Link>
            <div className="dropdown-content">
              <Link to="/about">About</Link>
              <Link to="/past-presidents">Past Presidents & Secretaries</Link>
              <Link to="/founders">Founders</Link>
              <Link to="/governing-body">Governing-Body</Link>
              <Link to="/management-committee">Management Committee</Link>
            </div>
          </div>
          <Link to="/history">HISTORY</Link>
          <Link to="/boys-hostel">BOYS HOSTEL</Link>
          <Link to="/donate">DONATE</Link>
          <Link to="/events">LATEST EVENTS</Link>
          <Link to="/gallery">GALLERY</Link>
          <Link to="/contact">CONTACT US</Link>
        </div>
      </nav>


    </header>
  );
};

export default Navbar;
