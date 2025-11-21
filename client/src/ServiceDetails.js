import React, { useState } from "react";
import "./ServiceDetails.css";
import BookingModal from "./BookingModal";

export default function ServiceDetails({ service, onBack }) {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="service-details">
      <button className="back-btn" onClick={onBack}>
        ← back to services
      </button>

      <div className="service-details-header">
        <div className="service-details-text">
          <h1 className="service-title-main">{service.title}</h1>

          <p className="service-pill">
            {service.category || "service"}{" "}
            {service.price && <span>• ${service.price}</span>}
          </p>
        </div>

        {service.image_url && (
          <img
            src={service.image_url}
            alt={service.title}
            className="service-image-hero"
          />
        )}
      </div>

      <div className="info-section">
        <h3>about this service</h3>
        <p className="detail-text">{service.description}</p>

        <hr />

        <h3>about the provider</h3>
        <p className="detail-text">
          <strong>name:</strong> {service.provider_name || "auc student"}
        </p>
        <p className="detail-text">
          <strong>email:</strong> {service.provider_email || "not provided"}
        </p>

        <hr />

        <h3>what to expect</h3>
        <ul className="expect-list">
          <li>provider will reach out to confirm details</li>
          <li>you can discuss preferred time and location</li>
          <li>payment details will be handled directly with the provider</li>
        </ul>

        <p className="notes-text">
          by booking this service, you are requesting to connect with the
          provider. they will confirm availability and next steps.
        </p>
      </div>

      <button
        className="book-btn"
        onClick={() => setShowBooking(true)}
      >
        book this service
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
