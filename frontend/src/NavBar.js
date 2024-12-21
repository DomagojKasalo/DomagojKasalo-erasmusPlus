import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ userRole }) => {
    console.log('NavBar userRole:', userRole); // Dodano za debug
    return (
        <div className="navbar">
            <Link to="/">Erasmus</Link>
            
            <Link to="/profile">Moj profil</Link>
            <Link to="/logout">Odjava</Link>
                
         
        </div>
    );
}

export default NavBar;
