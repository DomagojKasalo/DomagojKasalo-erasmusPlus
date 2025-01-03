import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [oib, setOib] = useState('');
  const [phone, setPhone] = useState('');
  const [university, setUniversity] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Za praćenje statusa brisanja
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Dohvati korisničke podatke s backenda
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = response.data;
        setFirstName(user.ime || 'Nema');
        setLastName(user.prezime || 'Nema prezimena');
        setEmail(user.email || 'Nema emaila');
        setAddress(user.adresa || 'Nema adrese');
        setOib(user.oib || 'Nema OIB-a');
        setPhone(user.telefon || 'Nema telefona');
        setUniversity(user.sveuciliste_id || 'Nema sveučilišta');
      } catch (error) {
        console.error('Greška pri dohvaćanju korisničkog profila:', error);
      }
    };

    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      // Ažuriranje korisničkih podataka na backendu
      const updatedUser = { 
        ime: firstName, 
        prezime: lastName, 
        email, 
        adresa: address, 
        oib, 
        telefon: phone, 
        sveuciliste_id: university
      };
      const response = await axios.put('http://localhost:5000/api/users/me', updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Korisnički profil ažuriran:', response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Greška pri ažuriranju korisničkog profila:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Jeste li sigurni da želite izbrisati svoj profil?')) {
      try {
        setIsDeleting(true);
        const response = await axios.delete('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.message); // Poruka o uspješnom brisanju
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/'; // Preusmjeravanje na početnu stranicu nakon brisanja
      } catch (error) {
        console.error('Greška pri brisanju korisničkog profila:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="profile-section">
      <div className="display-section">
        <div className="profile-details">
          <div>
            <label>Ime:</label>
            <span>{firstName}</span>
          </div>
          <div>
            <label>Prezime:</label>
            <span>{lastName}</span>
          </div>
          <div>
            <label>Email:</label>
            <span>{email}</span>
          </div>
          <div>
            <label>Adresa:</label>
            <span>{address}</span>
          </div>
          <div>
            <label>OIB:</label>
            <span>{oib}</span>
          </div>
          <div>
            <label>Telefon:</label>
            <span>{phone}</span>
          </div>
          <div>
            <label>Sveučilište:</label>
            <span>{university}</span>
          </div>
          <div className="edit-button-container">
            <button onClick={() => setIsEditing(true)}>Uredi</button>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="edit-section-vertical">
          <form className="edit-form" onSubmit={handleSave}>
            <div>
              <label htmlFor="first-name-form">Ime:</label>
              <input
                type="text"
                id="first-name-form"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="last-name-form">Prezime:</label>
              <input
                type="text"
                id="last-name-form"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-form">E-mail:</label>
              <input
                type="email"
                id="email-form"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="address-form">Adresa:</label>
              <input
                type="text"
                id="address-form"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="oib-form">OIB:</label>
              <input
                type="text"
                id="oib-form"
                value={oib}
                onChange={(e) => setOib(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phone-form">Telefon:</label>
              <input
                type="text"
                id="phone-form"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="university-form">Sveučilište:</label>
              <input
                type="text"
                id="university-form"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              />
            </div>
            <button type="button" onClick={() => setIsEditing(false)}>Spremi</button>
            <button type="button" onClick={() => setIsEditing(false)}>Odustani</button>
          </form>
        </div>
      )}

      {/* Gumb za brisanje korisničkog profila */}
      <div className="delete-button-container">
        <button 
          onClick={handleDelete} 
          disabled={isDeleting} 
          style={{ backgroundColor: isDeleting ? 'gray' : 'red', cursor: isDeleting ? 'not-allowed' : 'pointer' }}>
          {isDeleting ? 'Brisanje...' : 'Izbriši profil'}
        </button>
      </div>
    </div>
  );
};

export default Profile;
