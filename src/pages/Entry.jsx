// Example router (Entry.js or App.js)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from '../components/SignIn';
import Signup from '../components/SignUp';
import Chat from '../components/Chat'; // your Chat component
import App from '../App';
import Dashboard from '../components/Dashboard';

export default function Entry() {
  return (
    <Router>
      <Routes>
        {/* Sign In at "/" */}
        <Route path="/" element={<Signin />} />

        {/* Sign Up at "/signup" */}
        <Route path="/Dashboard" element={<Dashboard/>}/>
        <Route path="/signup" element={<Signup />} />

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
