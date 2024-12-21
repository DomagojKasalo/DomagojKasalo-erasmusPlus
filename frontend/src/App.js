import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginSignup from './components/LoginSignup/LoginSignup';
import Home from './components/Home';
import NavBar from './NavBar';
import Profile from "./Profile";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    console.log('User logged in:', isLoggedIn); // Dodano za debug
    console.log('User role:', userRole); // Dodano za debug
  };

  return (
    <Router>
      {isLoggedIn && <NavBar userRole={userRole} />}
      <Routes>
        <Route path="/" element={<LoginSignup onLogin={handleLogin} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} /> 
      </Routes>
    </Router>
  );
}

export default App;
