
import React, { useState } from 'react';
import ProfileSetup from './ProfileSetup';
import TutorList from './TutorList';
import './Dashboard.css';

function Dashboard({ name, email, onLogout, user }) {
  const [tab, setTab] = useState('find'); // 'find' | 'profile'

  return (
    <div className="dashboard">
      <div className="topbar">
        <div>
          <h2>Marketplace</h2>
          <div className="sub">Logged in as {name || user?.email} ({email})</div>
        </div>
        <button className="logout-btn" onClick={onLogout}>Log Out</button>
      </div>

      <div className="tabs">
        <button className={tab === 'find' ? 'active' : ''} onClick={() => setTab('find')}>Find Tutors</button>
        <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>My Profile</button>
      </div>

      <div className="tab-content">
        {tab === 'find' ? (
          <TutorList />
        ) : (
          <ProfileSetup user={user} onSaved={() => alert('Profile saved!')} />
        )}
      </div>
    </div>
  );
}


export default Dashboard;