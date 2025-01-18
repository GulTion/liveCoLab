// src/components/Chat.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:5000';

export default function Chat() {
  const navigate = useNavigate();
  const { roomId } = useParams(); // get roomId from URL
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  // 1) Check if user is "logged in"
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      // Not logged in? Go to sign in
      navigate('/');
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  // 2) Initialize socket & join room
  useEffect(() => {
    if (!username || !roomId) return;

    const newSocket = io(SERVER_URL, {
      transports: ['websocket']
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [username, roomId]);

  // 3) Set up listeners & join room
  useEffect(() => {
    if (!socket) return;

    // Join the room
    socket.emit('join-room', { roomId, username });

    // When a new message is received
    socket.on('receive-message', (data) => {
      // data => { message, senderName, roomId }
      setMessages((prev) => [...prev, `${data.senderName}: ${data.message}`]);
    });

    // When a user joins
    socket.on('user-joined', (data) => {
      // data => { message, username }
      setMessages((prev) => [...prev, `*** ${data.message} ***`]);
    });

    return () => {
      socket.off('receive-message');
      socket.off('user-joined');
    };
  }, [socket, roomId, username]);

  // Send a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    socket.emit('send-message', {
      roomId,
      message: messageInput.trim(),
      username
    });
    setMessageInput('');
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Chat Room: {roomId}</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>

      <div style={styles.chatWindow}>
        <div style={styles.messages}>
          {messages.map((msg, idx) => (
            <div key={idx} style={styles.messageItem}>{msg}</div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} style={styles.form}>
          <input
            type="text"
            style={styles.input}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit" style={styles.sendButton}>Send</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '40px auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    margin: 0
  },
  logoutButton: {
    padding: '8px 16px',
    borderRadius: '4px',
    backgroundColor: '#dc3545',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  chatWindow: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#fafafa'
  },
  messages: {
    border: '1px solid #ddd',
    borderRadius: '4px',
    height: '350px',
    overflowY: 'auto',
    padding: '10px',
    marginBottom: '10px',
    background: '#fff'
  },
  messageItem: {
    marginBottom: '6px'
  },
  form: {
    display: 'flex',
    gap: '10px'
  },
  input: {
    flex: 1,
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  sendButton: {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};
