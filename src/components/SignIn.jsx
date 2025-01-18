// src/components/SignIn.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SERVER_URL = 'http://localhost:5000'; // adjust if needed

export default function SignIn() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  // Handle form submission
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${SERVER_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        // Store username in localStorage (or however you want to track user)
        localStorage.setItem('username', username);

        // Navigate to chat (no room ID here!)
        navigate('/Dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sign In</h2>
      <div style={styles.formCard}>
        <form onSubmit={handleSignIn} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={styles.button}>Sign In</button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.linkContainer}>
          <span>Don't have an account?</span>
          <Link to="/signup" style={styles.link}> Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

// Basic inline styles
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '400px',
    margin: '60px auto',
    textAlign: 'center',
  },
  title: {
    marginBottom: '10px',
  },
  formCard: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '20px',
    background: '#fefefe'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  formGroup: {
    textAlign: 'left'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #999'
  },
  button: {
    padding: '10px',
    cursor: 'pointer',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: '#fff',
    fontWeight: 'bold'
  },
  error: {
    marginTop: '15px',
    color: 'red'
  },
  linkContainer: {
    marginTop: '20px'
  },
  link: {
    marginLeft: '5px',
    color: '#007BFF',
    textDecoration: 'none'
  }
};
