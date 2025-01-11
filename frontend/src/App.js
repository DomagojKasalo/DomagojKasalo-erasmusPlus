import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginSignup from './components/LoginSignup/LoginSignup';
import Profile from './Profile';
import Competition from './Competition';
import NavBar from './NavBar';
import UserPage from './UserPage';
import Schools from './School';
import Companies from './Companies';
import Prijava from './Prijava';
import CompetitionResult from './CompetitionResult';
import Home from './Home';
import './App.css'; // Uvjerite se da je CSS datoteka uključena

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Provjeri postoji li token
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      document.body.classList.remove('login-background', 'signup-background');
      document.body.classList.add('home-background');
    } else {
      document.body.classList.add('login-background');
      document.body.classList.remove('signup-background');
    }
  }, [isAuthenticated]);

  return (
    <Router>
      {isAuthenticated && <NavBar handleLogout={handleLogout} />}
      <div className="content" style={{ paddingTop: isAuthenticated ? '60px' : '0px' }}>
        <Routes>
          {/* Ruta za Login */}
          <Route path="/" element={<LoginSignup onLogin={handleLogin} />} />
          
          {/* Ako je autentificiran, omogući pristup ostalim rutama */}
          {isAuthenticated ? (
            <>
              <Route path="/home" element={<Home />} /> {/* Home na /home */}
              <Route path="/natjecaji" element={<Competition />} />
              <Route path="/competition-result" element={<CompetitionResult />} />
              <Route path="/users" element={<UserPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/schools" element={<Schools />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/prijave" element={<Prijava />} />
              <Route path="*" element={<Navigate to="/home" />} /> 
            </>
          ) : (
            <Route path="*" element={<Navigate to="/" />} /> 
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
