import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

function BrowseServices({ onSelectService }) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get('/api/services');
        setServices(res.data.services || []);
      } catch (err) {
        console.error("Error loading services:", err);
      }
    };
    load();
  }, []);

  return (
    <div className="grid-container">
      {services.length === 0 ? (
        <p>No services posted yet.</p>
      ) : (
        services.map((s) => (
          <div 
            className="card" 
            key={s.id}
            onClick={() => onSelectService(s)}  // 🔥 MAKE CLICK WORK
            style={{ cursor: "pointer" }}      // 🔥 Show click cursor
          >
            {s.image_url && (
              <img src={s.image_url} alt={s.title} className="card-image" />
            )}
            <h3 className="card-title">{s.title}</h3>
            <p className="card-category">{s.category}</p>
            {s.price && <p className="card-price">${s.price}</p>}
            <p className="card-description">{s.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default BrowseServices;
