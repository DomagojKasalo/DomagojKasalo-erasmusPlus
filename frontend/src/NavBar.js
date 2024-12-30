import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ handleLogout }) => {
  const navigate = useNavigate();

  const onLogoutClick = () => {
    handleLogout();
    navigate('/'); // Preusmjeravanje na početnu stranicu nakon odjave
  };

  return (
    <nav className="navbar">
      <div className="navbar-title">Erasmus</div> {/* Naslov bez linka */}
      <ul className="navbar-links">
        <li>
          <Link to="/competitions">Svi natječaji</Link> {/* Provjerimo putanju */}
        </li>
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
