import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginSignup from './components/LoginSignup/LoginSignup';
import Profile from './Profile';
import Competition from './Competition';
import NavBar from './NavBar';
import UserPage from './UserPage';
import Schools  from './School';
import Companies from './Companies';
import Prijava from './Prijava';
import CompetitionResult from './CompetitionResult';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated && <NavBar handleLogout={handleLogout} />}
      <div className="content" style={{ paddingTop: isAuthenticated ? '60px' : '0px' }}>
        <Routes>
          <Route path="/" element={<LoginSignup onLogin={handleLogin} />} />
          {isAuthenticated ? (
            <>
              <Route path="/natjecaji" element={<Competition />} />
              <Route path="/competition-result" element={<CompetitionResult />} />
              <Route path="/users" element={<UserPage />} /> 
              <Route path="/profile" element={<Profile />} />
              <Route path="/odjava" element={<Navigate to="/" />} />
              <Route path="/schools" element={<Schools to="/" />} />
              <Route path="/companies" element={<Companies to="/" />} />
              <Route path="/prijave" element={<Prijava />}/>
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
