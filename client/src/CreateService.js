import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

function CreateService({ user }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);

    const res = await axios.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let image_url = null;
      if (imageFile) {
        image_url = await handleImageUpload();
      }

      // If category is "other", save the customCategory instead
      const finalCategory = category === "other" ? customCategory : category;

      const res = await axios.post("/api/service", {
        provider_id: user?.id,
        title,
        category: finalCategory,
        price,
        description,
        image_url,
      });

      setMessage("Service listing created successfully!");
      setTitle('');
      setCategory('');
      setCustomCategory('');
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
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="dropdown"
        >
          <option value="">Select a category...</option>
          <option value="hair">Hair</option>
          <option value="nails">Nails</option>
          <option value="makeup">Makeup</option>
          <option value="tutoring">Tutoring</option>
          <option value="photography">Photography</option>
          <option value="fashion">Fashion & Styling</option>
          <option value="tech">Tech Services</option>
          <option value="music">Music / Creative</option>
          <option value="moving">Moving / Lifting</option>
          <option value="cleaning">Cleaning</option>
          <option value="errands">Errands & Tasks</option>
          <option value="other">Other</option>
        </select>

        {/* SHOW CUSTOM CATEGORY INPUT ONLY IF "OTHER" IS SELECTED */}
        {category === "other" && (
          <input
            type="text"
            placeholder="Enter custom category..."
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            required
            className="dropdown"
          />
        )}

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
