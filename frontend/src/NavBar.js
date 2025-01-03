import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Trebat ćete axios za slanje zahtjeva
import './NavBar.css';

const NavBar = ({ handleLogout }) => {
  const [userRole, setUserRole] = useState(null); // Držimo stanje za ulogu
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Dohvati token iz localStorage

  useEffect(() => {
    if (token) {
      // Ako je korisnik prijavljen, dohvati podatke o korisniku s backend-a
      const fetchUserRole = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/users/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Postavi ulogu na temelju odgovora
          setUserRole(response.data.uloga); // Pretpostavljamo da `uloga` dolazi u odgovoru
        } catch (error) {
          console.error('Greška pri dohvaćanju podataka o korisniku:', error);
        }
      };

      fetchUserRole();
    }
  }, [token]);

  // Provjera uloge
  console.log('User role from backend:', userRole); // Dodajte log za provjeru

  const onLogoutClick = () => {
    handleLogout();
    navigate('/'); // Preusmjeravanje na početnu stranicu nakon odjave
  };

  return (
    <nav className="navbar">
      <div className="navbar-title">Erasmus</div> {/* Naslov bez linka */}
      <ul className="navbar-links">
        <li>
          <Link to="/competitions">Svi natječaji</Link>
        </li>
        <li>
          <Link to="/profile">Moj Profil</Link>
        </li>
        <></>

        {/* Prikazivanje opcije "Korisnici" samo ako je korisnik admin */}
        {userRole === 'admin' && (
          <li>
            <Link to="/users">Korisnici</Link>
          </li>
        )}

        {/* Prikazivanje opcije "Rezultati" samo ako je korisnik nastavnik ili admin */}
        {(userRole === 'nastavnik' || userRole === 'admin') && (
          <li>
            <Link to="/competition-result">Rezultati</Link>
          </li>
        )}


        <li>
          <button onClick={onLogoutClick} className="logout-button">Odjava</button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
