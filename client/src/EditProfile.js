import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

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
    <div className="form-card">
      <h2 className="section-title">Edit Profile</h2>

      <form onSubmit={handleSave} className="service-form">
        <label>Your Name *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />

        <label>School</label>
        <input value={school} onChange={(e) => setSchool(e.target.value)} />

        <label>Major</label>
        <input value={major} onChange={(e) => setMajor(e.target.value)} />

        <label>Your Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="provider">Provider</option>
        </select>

        <label>Bio</label>
        <textarea 
          value={bio} 
          onChange={(e) => setBio(e.target.value)} 
          placeholder="Tell us about yourself..."
        />

        <button className="primary-btn" type="submit">Save</button>
      </form>

      {message && <p className="message-text">{message}</p>}
    </div>
  );
}

export default EditProfile;
