import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

function CreateService({ user }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);

    // Your backend route for uploading images (you can customize later)
    const res = await axios.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.url; // backend returns the Supabase URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let image_url = null;
      if (imageFile) {
        image_url = await handleImageUpload();
      }

      const res = await axios.post("/api/service", {
        provider_id: user?.id,
        title,
        category,
        price,
        description,
        image_url,
      });

      setMessage("Service listing created successfully!");
      setTitle('');
      setCategory('');
      setPrice('');
      setDescription('');
      setImageFile(null);

    } catch (err) {
      setMessage("Error creating service: " + err.message);
    }
  };

  return (
    <div className="form-card">
      <h2 className="section-title">Create a New Service Listing</h2>

      <form onSubmit={handleSubmit} className="service-form">

        <label>Title *</label>
        <input 
          type="text"
          placeholder="e.g., Knotless Braids, Math Tutoring, Photography"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Category *</label>
        <input 
          type="text"
          placeholder="Type any category..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <label>Price (optional)</label>
        <input 
          type="number"
          placeholder="e.g., 40"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <label>Description (optional)</label>
        <textarea 
          placeholder="Describe your service..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Upload Photo (optional)</label>
        <input 
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <button type="submit" className="primary-btn">
          Post Service
        </button>

        {message && <p className="message-text">{message}</p>}
      </form>
    </div>
  );
}

export default CreateService;
