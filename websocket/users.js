// server/users.js

// In-memory "database"
const users = []; // Each user: { username, password }

function findUser(username) {
  return users.find(u => u.username === username);
}

function createUser({ username, password }) {
  // For simplicity, no hashing! Not for production.
  users.push({ username, password });
}

// Basic validation
function validateCredentials(username, password) {
  const user = findUser(username);
  if (!user) return false;
  return user.password === password; // again, not secure in real apps
}

module.exports = {
  findUser,
  createUser,
  validateCredentials
};
