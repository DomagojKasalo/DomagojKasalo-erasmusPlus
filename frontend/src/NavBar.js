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
      <ul>
        <li>
          <Link to="/home">Početna</Link>
        </li>
        <li>
          <Link to="/profile">Moj Profil</Link>
        </li>
        <li>
          <button onClick={onLogoutClick}>Odjava</button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
