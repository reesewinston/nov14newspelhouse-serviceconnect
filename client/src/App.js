import React, { useState } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [authMode, setAuthMode] = useState('register');
  const [user, setUser] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailPattern = /@(spelman\.edu|morehouse\.edu)$/;
    if (!emailPattern.test(email)) {
      setMessage('email must end with @spelman.edu or @morehouse.edu');
      return;
    }

    try {
      const res = await axios.post('/register', { name, email, password });
      setMessage(res.data.message || 'verification code sent');
      setIsEmailSent(true);
    } catch (err) {
      setMessage('error registering: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/login', { email, password });
      if (res.data.success) {
        const u = res.data.user;
        setUser(u);
        setName(u?.name || 'user');
        setMessage('login successful');
        setIsVerified(true);
      } else {
        setMessage(res.data.message || 'login failed');
      }
    } catch (err) {
      setMessage('error logging in: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const res = await axios.post('/verify', { email, verificationCode });
      setMessage(res.data.message || 'email verified');

      if (res.data.success) {
        // auto-login after verification
        const login = await axios.post('/login', { email, password });
        if (login.data.success) {
          const u = login.data.user;
          setUser(u);
          setName(u?.name || 'user');
          setIsVerified(true);
        }
      }
    } catch (err) {
      setMessage('invalid verification code');
    }
  };

  const handleLogout = () => {
    setName('');
    setEmail('');
    setPassword('');
    setMessage('');
    setVerificationCode('');
    setIsEmailSent(false);
    setIsVerified(false);
    setUser(null);
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const renderRegistrationForm = () => (
    <form onSubmit={handleRegister}>
      <div>
        <label>name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit">register</button>
    </form>
  );

  const renderVerificationForm = () => (
    <div>
      <h2>verify email</h2>
      <label>verification code</label>
      <input
        type="text"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        required
      />
      <button onClick={handleVerifyEmail}>verify</button>
    </div>
  );

  return (
    <>
      {!isVerified ? (
        <div className="auth-container">
          <div className="App">
            <h1>spelhouse service connect</h1>
            <p className="subtitle">a platform for spelman + morehouse students to share services</p>

            {isEmailSent ? (
              renderVerificationForm()
            ) : (
              <>
                <div className="auth-tabs">
                  <button
                    className={`tab-btn ${authMode === 'register' ? 'active' : ''}`}
                    onClick={() => setAuthMode('register')}
                  >
                    register
                  </button>
                  <button
                    className={`tab-btn ${authMode === 'login' ? 'active' : ''}`}
                    onClick={() => setAuthMode('login')}
                  >
                    login
                  </button>
                </div>
                {authMode === 'register' ? renderRegistrationForm() : renderLoginForm()}
              </>
            )}

            {message && <p className="message">{message}</p>}
          </div>
        </div>
      ) : (
        <Dashboard name={name} email={email} onLogout={handleLogout} user={user} />
      )}
    </>
  );
}

export default App;
