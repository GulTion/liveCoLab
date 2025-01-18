// Example router (Entry.js or App.js)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import Chat from '../components/Chat'; // your Chat component
import App from '../App';

export default function Entry() {
  return (
    <Router>
      <Routes>
        {/* Sign In at "/" */}
        <Route path="/" element={<SignIn />} />

        {/* Sign Up at "/signup" */}
        <Route path="/signup" element={<SignUp />} />

        {/* Chat at "/chat" */}
        <Route path="/chat" element={<Chat />} />
        {/* <Route path="/chat" element={<Chat />} /> */}


         <Route path="/project/:id" element={<App/>} />
        {/* 404 fallback */}
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </Router>
  );
}
