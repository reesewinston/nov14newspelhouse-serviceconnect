import React, { useState } from "react";
import "./ServiceDetails.css";
import BookingModal from "./BookingModal";

export default function ServiceDetails({ service, onBack }) {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="service-details">

      <button className="back-btn" onClick={onBack}>← Back to Services</button>

      {/* Service Header */}
      <h1 className="service-title">{service.title}</h1>

      {/* Optional Photo */}
      {service.image_url && (
        <img src={service.image_url} alt={service.title} className="service-image" />
      )}

      {/* Info Section */}
      <div className="info-section">

        <p><strong>Category:</strong> {service.category}</p>

        {service.price && (
          <p><strong>Price:</strong> ${service.price}</p>
        )}

        <p><strong>Description:</strong> {service.description}</p>

        <hr/>

        {/* Provider info */}
        <h3>About the Provider</h3>
        <p><strong>Name:</strong> {service.provider_name || "AUC Student"}</p>
        <p><strong>Email:</strong> {service.provider_email || "Not provided"}</p>

        <hr/>

        <h3>What to Expect</h3>
        <ul className="expect-list">
          <li>Provider will reach out to confirm details</li>
          <li>Discuss preferred time & location</li>
          <li>Bring/payment details will be discussed directly</li>
        </ul>

        <h3>Booking Notes</h3>
        <p className="notes-text">
          By booking this service, you are requesting to connect with the provider.
          They will confirm availability and next steps.
        </p>

      </div>

      <button 
        className="book-btn"
        onClick={() => setShowBooking(true)}
      >
        Book This Service
      </button>

      {showBooking && (
        <BookingModal 
          service={service}
          onClose={() => setShowBooking(false)}
        />
      )}
    </div>
  );
}
