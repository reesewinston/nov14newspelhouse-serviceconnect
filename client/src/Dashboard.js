import React, { useState } from 'react';
import BrowseServices from './BrowseServices';
import CreateService from './CreateService';
import MyServices from './MyServices';
import EditProfile from './EditProfile';
import './Dashboard.css';

function Dashboard({ name, email, onLogout, user }) {
  const [tab, setTab] = useState('browse'); 
  // browse | create | my | profile

  return (
    <div className="dashboard">

      {/* Top Navigation Bar */}
      <nav className="topnav">
        <div className="logo">
          <span className="sh-blue">Spel</span>
          <span className="sh-maroon">House</span> 
          <span className="sh-black"> Service Connect</span>
        </div>

        <div className="nav-links">
          <button 
            className={tab === 'browse' ? 'active' : ''} 
            onClick={() => setTab('browse')}
          >
            Browse Services
          </button>
          <button 
            className={tab === 'create' ? 'active' : ''} 
            onClick={() => setTab('create')}
          >
            Create Listing
          </button>
          <button 
            className={tab === 'my' ? 'active' : ''} 
            onClick={() => setTab('my')}
          >
            My Listings
          </button>
          <button 
            className={tab === 'profile' ? 'active' : ''} 
            onClick={() => setTab('profile')}
          >
            Edit Profile
          </button>

          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h1>Welcome to SpelHouse Service Connect</h1>
        <p>A platform for AUC students to offer and discover services.</p>
      </header>

      {/* Tab Content */}
      <div className="content-container">
        {tab === 'browse' && <BrowseServices />}
        {tab === 'create' && <CreateService user={user} />}
        {tab === 'my' && <MyServices user={user} />}
        {tab === 'profile' && <EditProfile user={user} />}
      </div>

    </div>
  );
}

export default Dashboard;
