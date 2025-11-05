import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TutorCard from './TutorCard';
import './TutorList.css';

export default function TutorList() {
  const [tutors, setTutors] = useState([]);
  const [subject, setSubject] = useState('');
  const [maxRate, setMaxRate] = useState('');

  const fetchTutors = async () => {
    const res = await axios.get('/api/tutors', { params: { subject, maxRate } });
    if (res.data.success) setTutors(res.data.tutors);
  };

  useEffect(() => { fetchTutors(); }, []); // initial load

  return (
    <div>
      <h2>Find a Tutor</h2>
      <div className="filters">
        <input placeholder="Subject (e.g. Calculus)" value={subject} onChange={e => setSubject(e.target.value)} />
        <input placeholder="Max Rate (e.g. 40)" value={maxRate} onChange={e => setMaxRate(e.target.value)} />
        <button onClick={fetchTutors}>Search</button>
      </div>
      <div className="tutor-grid">
        {tutors.map(tutor => <TutorCard key={tutor.id} tutor={tutor} />)}
        {tutors.length === 0 && <p>No tutors found with those filters.</p>}
      </div>
    </div>
  );
}
