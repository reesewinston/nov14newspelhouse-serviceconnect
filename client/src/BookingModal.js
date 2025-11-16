import React, { useState } from "react";
import "./BookingModal.css";

export default function BookingModal({ service, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Later you can send this to backend or email
    alert(`Booking request sent!\n\nService: ${service.title}`);

    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div className="modal-overlay" onClick={onClose}></div>

      {/* Modal box */}
      <div className="booking-modal">
        <h2>Book {service.title}</h2>

        <form onSubmit={handleSubmit} className="modal-form">

          <label>Your Name</label>
          <input 
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Your Email</label>
          <input 
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Preferred Date / Time</label>
          <input 
            type="datetime-local"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label>Message to Provider</label>
          <textarea
            placeholder="Add a note about what you need..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button className="submit-btn" type="submit">
            Submit Booking Request
          </button>

          <button className="close-btn" onClick={onClose} type="button">
            Cancel
          </button>
        </form>
      </div>
    </>
  );
}
