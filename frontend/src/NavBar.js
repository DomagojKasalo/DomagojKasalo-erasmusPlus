import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
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
          <Link to="/odjava">Odjava</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
