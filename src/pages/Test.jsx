// src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000'; // adjust if needed

const App = () => {
  // Local state
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  // Initialize socket connection
  useEffect(() => {
    // Create connection
    const newSocket = io(SERVER_URL, {
      transports: ['websocket'] // you can also leave defaults
    });
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Listen for incoming events
  useEffect(() => {
    if (!socket) return;

    // When a new message is received
    socket.on('receive-message', (data) => {
      setMessages((prev) => [...prev, `(${data.senderId}): ${data.message}`]);
    });

    // When a user joins the room
    socket.on('user-joined', (data) => {
      setMessages((prev) => [...prev, `*** ${data.message} ***`]);
    });

    // Cleanup listeners on socket re-init or unmount
    return () => {
      socket.off('receive-message');
      socket.off('user-joined');
    };
  }, [socket]);

  // Handle joining a room
  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!socket || !roomId.trim()) return;

    // Emit join-room event to server
    socket.emit('join-room', roomId.trim());
    setJoined(true);
  };

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!socket || !messageInput.trim() || !roomId) return;

    socket.emit('send-message', {
      roomId,
      message: messageInput.trim(),
    });
    setMessageInput('');
  };

  return (
    <div style={styles.container}>
      <h1>Collaborative Chat (React + Socket.IO)</h1>

      {/* Join room form */}
      {!joined && (
        <form onSubmit={handleJoinRoom} style={styles.form}>
          <label htmlFor="room">Room ID:</label>
          <input
            id="room"
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Join</button>
        </form>
      )}

      {/* Chat UI */}
      {joined && (
        <div style={styles.chatContainer}>
          <h2>Room: {roomId}</h2>
          <div style={styles.messagesContainer}>
            {messages.map((msg, index) => (
              <div key={index} style={styles.message}>
                {msg}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} style={styles.form}>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              style={styles.input}
              placeholder="Type a message..."
            />
            <button type="submit" style={styles.button}>Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

// Some basic inline styles for clarity
const styles = {
  container: {
    maxWidth: 600,
    margin: '40px auto',
    fontFamily: 'Arial, sans-serif'
  },
  form: {
    display: 'flex',
    marginBottom: 10
  },
  input: {
    flex: 1,
    marginRight: 8,
    padding: 8
  },
  button: {
    padding: '0 16px'
  },
  chatContainer: {
    border: '1px solid #ccc',
    padding: 16
  },
  messagesContainer: {
    height: 300,
    overflowY: 'auto',
    border: '1px solid #aaa',
    marginBottom: 10,
    padding: 10
  },
  message: {
    marginBottom: 5
  }
};

export default App;
