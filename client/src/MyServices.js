import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

function MyServices({ user }) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get('/api/services');
        const mine = res.data.services.filter(
          (s) => s.provider_id === user?.id
        );
        setServices(mine);
      } catch (err) {
        console.error(err);
      }
    };

    if (user?.id) load();
  }, [user]);

  return (
    <div className="grid-container">
      {services.length === 0 ? (
        <p>You have not created any service listings yet.</p>
      ) : (
        services.map((s) => (
          <div className="card" key={s.id}>
            {s.image_url && (
              <img src={s.image_url} alt={s.title} className="card-image" />
            )}
            <h3 className="card-title">{s.title}</h3>
            {s.category && <p className="card-category">{s.category}</p>}
            {s.price && <p className="card-price">${s.price}</p>}
            <p className="card-description">{s.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyServices;
