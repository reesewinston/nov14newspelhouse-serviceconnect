// server/server.js

const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const multer = require('multer');

// log url for debugging
console.log("supabase url:", process.env.SUPABASE_URL);

// supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const app = express();
app.use(express.json());

// allow serving react build
app.use(express.static(path.join(__dirname, '../client/build')));

/* ======================================================
   AUTH (Spelman + Morehouse Only)
   ====================================================== */

// REGISTER
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  const emailPattern = /@(spelman\.edu|morehouse\.edu)$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'email must end with @spelman.edu or @morehouse.edu',
    });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) throw error;

    res.json({
      success: true,
      message: 'registration successful. check your email for a verification code.',
    });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'error registering user',
    });
  }
});

// LOGIN
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    res.json({
      success: true,
      message: 'login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
      },
    });
  } catch (err) {
    console.error('login error:', err);
    res.status(401).json({
      success: false,
      message: 'invalid email or password',
    });
  }
});

// VERIFY EMAIL (OTP)
app.post('/verify', async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: verificationCode,
      type: 'signup',
    });

    if (error) {
      console.error('verify error:', error);
      return res.status(400).json({
        success: false,
        message: 'invalid verification code',
      });
    }

    res.json({ success: true, message: 'email verified' });
  } catch (err) {
    console.error('verify error:', err);
    res.status(500).json({
      success: false,
      message: 'error verifying email',
    });
  }
});


/* ======================================================
   PROFILE (students + providers)
   ====================================================== */

app.post('/api/profile', async (req, res) => {
  try {
    const { id, role, name, school, major, bio, photo_url } = req.body;

    if (!id || !role || !name) {
      return res.status(400).json({
        success: false,
        message: 'id, role, and name are required',
      });
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        [
          {
            id,
            role,
            name,
            school,
            major,
            bio,
            photo_url,
          },
        ],
        { onConflict: 'id' }
      )
      .select('*')
      .single();

    if (error) throw error;

    res.json({ success: true, message: 'profile saved', profile: data });
  } catch (err) {
    console.error('profile error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET PROFILE
app.get('/api/profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json({ success: true, profile: data });
  } catch (err) {
    res.status(404).json({ success: false, message: 'profile not found' });
  }
});

/* ======================================================
   SERVICES (hair, braids, nails, tutoring, etc.)
   ====================================================== */

// CREATE NEW SERVICE (DO NOT SEND id ON CREATE)
app.post('/api/service', async (req, res) => {
  try {
    const {
      id,              // will be undefined for new service
      provider_id,
      title,
      category,
      price,
      description,
      image_url,
    } = req.body;

    // REQUIRED FIELDS
    if (!provider_id || !title) {
      return res.status(400).json({
        success: false,
        message: 'provider_id and title are required',
      });
    }

    // NEW SERVICE PAYLOAD — DO NOT INCLUDE id IF CREATING NEW
    const payload = {
      provider_id,
      title,
      category,
      price,
      description,
      image_url,
    };

    // If ID exists → this is an update
    if (id) payload.id = id;

    // Insert (or update) service
    const { data, error } = await supabase
      .from('services')
      .insert(payload)
      .select('*')
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: id ? 'service updated' : 'service created',
      service: data,
    });

  } catch (err) {
    console.error('service error:', err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


// GET ALL SERVICES
app.get('/api/services', async (req, res) => {
  try {
    const { category, maxPrice } = req.query;

    let q = supabase.from('services').select('*');

    if (category) q = q.eq('category', category);

    if (maxPrice) {
      const num = Number(maxPrice);
      if (!Number.isNaN(num)) q = q.lte('price', num);
    }

    const { data, error } = await q;
    if (error) throw error;

    res.json({ success: true, services: data });
  } catch (err) {
    console.error('services list error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});


/* ======================================================
   IMAGE UPLOAD (Supabase Storage)
   ====================================================== */

const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "no file uploaded" });
    }

    const file = req.file;
    const ext = file.originalname.split('.').pop();
    const filename = `${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('service-images')
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('service-images')
      .getPublicUrl(filename);

    return res.json({ url: urlData.publicUrl });

  } catch (err) {
    console.error("upload error:", err);
    return res.status(500).json({ error: err.message });
  }
});


/* ======================================================
   SERVE REACT APP
   ====================================================== */

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
