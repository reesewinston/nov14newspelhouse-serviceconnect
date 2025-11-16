import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import "./EditProfile.css";

function EditProfile({ user }) {
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [major, setMajor] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('student');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      try {
        const res = await axios.get(`/api/profile/${user.id}`);
        if (res.data?.profile) {
          setName(res.data.profile.name);
          setSchool(res.data.profile.school || '');
          setMajor(res.data.profile.major || '');
          setBio(res.data.profile.bio || '');
          setRole(res.data.profile.role || 'student');
        }
      } catch (err) {}
    };
    load();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/profile', {
        id: user.id,
        name,
        school,
        major,
        bio,
        role,
      });
      setMessage("Profile updated!");
    } catch (err) {
      setMessage("Error updating profile.");
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Edit Profile</h2>

      <form onSubmit={handleSave}>
        
        <label className="profile-label">Your Name *</label>
        <input 
          className="profile-input"
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />

        <label className="profile-label">School</label>
        <input 
          className="profile-input"
          value={school} 
          onChange={(e) => setSchool(e.target.value)} 
        />

        <label className="profile-label">Major</label>
        <input 
          className="profile-input"
          value={major} 
          onChange={(e) => setMajor(e.target.value)} 
        />

        <label className="profile-label">Your Role</label>
        <select 
          className="profile-select"
          value={role} 
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="provider">Provider</option>
        </select>

        <label className="profile-label">Bio</label>
        <textarea
          className="profile-textarea"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
        />

        <button className="save-btn" type="submit">Save</button>
      </form>

      {message && <p className="message-text">{message}</p>}
    </div>
  );
}

export default EditProfile;
