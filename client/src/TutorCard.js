import React from 'react';
import './TutorCard.css';

export default function TutorCard({ tutor }) {
  return (
    <div className="tutor-card">
      <div className="tutor-photo-wrap">
        <img
          className="tutor-photo"
          src={tutor.photo_url || 'https://via.placeholder.com/200?text=Tutor'}
          alt={tutor.name}
        />
      </div>
      <div className="tutor-info">
        <h3>{tutor.name}</h3>
        <p className="subjects">{(tutor.subjects || []).join(', ')}</p>
        {tutor.hourly_rate != null && <p className="rate">${tutor.hourly_rate}/hr</p>}
        {tutor.school && <p className="school">{tutor.school}</p>}
        {tutor.bio && <p className="bio">{tutor.bio}</p>}
      </div>
    </div>
  );
}
