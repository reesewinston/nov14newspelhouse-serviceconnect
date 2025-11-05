import React, { useState, useRef } from 'react';
import axios from 'axios';
import { supabase } from './supabaseClient';

const SUBJECT_LIBRARY = [
  'Algebra','Geometry','Calculus','Statistics','Physics','Chemistry','Biology',
  'English','History','Economics','Computer Science','Spanish','French'
];

export default function ProfileSetup({ user, onSaved }) {
  const [role, setRole] = useState('student');
  const [name, setName] = useState(user?.name || '');
  const [school, setSchool] = useState('');
  const [major, setMajor] = useState('');
  const [grade, setGrade] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const toggleSubject = (s) => {
    setSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const uploadPhoto = async (file) => {
    if (!file || !user?.id) return;
    const path = `avatars/${user.id}-${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('avatars').upload(path, file, { upsert: false });
    if (error) throw error;
    const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
    setPhotoUrl(pub.publicUrl);
  };

  const handleFileChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      await uploadPhoto(f);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const payload = {
        id: user.id,
        role,
        name,
        school,
        major,
        grade,
        hourly_rate: role === 'tutor' && hourlyRate ? Number(hourlyRate) : null,
        subjects,
        photo_url: photoUrl || null,
        bio
      };
      const res = await axios.post('/api/profile', payload);
      if (res.data.success) onSaved?.(res.data.profile);
      else alert(res.data.message || 'Save failed');
    } catch (err) {
      alert('Save failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h2>Create / Update Profile</h2>

      <label>Role</label>
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="tutor">Tutor</option>
      </select>

      <label>Name</label>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />

      <label>School</label>
      <input value={school} onChange={e => setSchool(e.target.value)} placeholder="School" />

      <label>Major</label>
      <input value={major} onChange={e => setMajor(e.target.value)} placeholder="Major (optional)" />

      <label>Grade</label>
      <input value={grade} onChange={e => setGrade(e.target.value)} placeholder="e.g., K-12, Freshman" />

      {role === 'tutor' && (
        <>
          <label>Hourly Rate (USD)</label>
          <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} placeholder="e.g., 30" />
        </>
      )}

      <label>Subjects</label>
      <div className="chips">
        {SUBJECT_LIBRARY.map(s => (
          <button
            key={s}
            type="button"
            className={`chip ${subjects.includes(s) ? 'selected' : ''}`}
            onClick={() => toggleSubject(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <label>Photo</label>
      <input type="file" accept="image/*" ref={fileRef} onChange={handleFileChange} />
      {photoUrl && <img src={photoUrl} alt="avatar" style={{ width: 120, borderRadius: 10, marginTop: 8 }} />}

      <label>Bio</label>
      <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} placeholder="Short intro..." />

      <button onClick={saveProfile} disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
    </div>
  );
}
