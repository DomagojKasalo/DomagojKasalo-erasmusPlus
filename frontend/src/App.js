import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginSignup from './components/LoginSignup/LoginSignup';
import Profile from './Profile'; // Provjerimo putanju
import Competition from './Competition'; // Provjerimo putanju
import NavBar from './NavBar'; // Provjerimo putanju

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated && <NavBar handleLogout={handleLogout} />} {/* Prikaz navigacijske trake samo ako je korisnik prijavljen */}
      <div className="content" style={{ paddingTop: isAuthenticated ? '60px' : '0px' }}>
        <Routes>
          <Route path="/" element={<LoginSignup onLogin={handleLogin} />} />
          {isAuthenticated && (
            <>
              <Route path="/competitions" element={<Competition />} /> {/* Korištenje Competition komponente */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/odjava" element={<Navigate to="/" />} />
            </>
          )}
          {!isAuthenticated && <Route path="*" element={<Navigate to="/" />} />} {/* Redirekcija neautoriziranih korisnika */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
