// src/components/SignUp.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SERVER_URL } from '../utils/auth';
// const SERVER_URL = 'http://192.168.244.12:8080'; // adjust if needed

export default function SignUp() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState("");

  const [error, setError] = useState('');

  // Handle form submission
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${SERVER_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName:username,email, password }),
      });
      const data = await res.json();

      if (res.status === 200) {
        // Store username locally
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userName', username);


        // Navigate to chat
        navigate('/dashboard');
      } else {
        setError(data.message || 'Sign up failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sign Up</h2>
      <div style={styles.formCard}>
        <form onSubmit={handleSignUp} style={styles.form}>
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

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={styles.button}>Sign Up</button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.linkContainer}>
          <span>Already have an account?</span>
          <Link to="/" style={styles.link}> Sign In</Link>
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
    backgroundColor: '#28a745',
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
