import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NavBar.css';

const NavBar = ({ handleLogout }) => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      const fetchUserRole = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/users/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          const role = response.data.uloga;
          setUserRole(role);  // Postavite ulogu u stanje
  
          // Spremite ulogu u localStorage
          localStorage.setItem('role', role);  
        } catch (error) {
          console.error('Greška pri dohvaćanju podataka o korisniku:', error);
        }
      };
  
      fetchUserRole();
    }
  }, [token]);

  console.log('User role from backend:', userRole);

  const onLogoutClick = () => {
    handleLogout();
    navigate('/');
  };

  const goToHomePage = () => {
    navigate('/home');
  };

  return (
    <nav className="navbar">
      <div className="navbar-title" onClick={goToHomePage} style={{ cursor: 'pointer' }}>
        Erasmus
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/natjecaji">Svi natječaji</Link>
        </li>
        {/* Nastavnik i admin opcija */}
        {(userRole === 'nastavnik' || userRole === 'admin') && (
          <li>
            <Link to="/competition-result">Rezultati</Link>
          </li>
        )}

        {/* Admin opcije */}
        {userRole === 'admin' && (
          <>
            <li>
              <Link to="/users">Korisnici</Link>
            </li>
            <li>
              <Link to="/schools">Sveučilišta</Link>
            </li>
            <li>
              <Link to="/companies">Tvrtke</Link>
            </li>
            <li>
              <Link to="/prijave">Prijave</Link>
            </li>
          </>
        )}
        
        <li>
          <Link to="/profile">Moj Profil</Link>
        </li>
        <li>
          <button onClick={onLogoutClick} className="logout-button">Odjava</button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
