import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
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
        setProfileImage(user.profileImage || 'profile-placeholder.png');
      } catch (error) {
        console.error('Greška pri dohvaćanju korisničkog profila:', error);
      }
    };

    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result); // Postavljanje nove slike u stanje
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      // Ažuriranje korisničkih podataka na backendu
      const updatedUser = { ime: firstName, prezime: lastName, email, profileImage };
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

  return (
    <div className="profile-section">
      <div className="display-section">
        <img src={profileImage || 'profile-placeholder.png'} alt="Profile" width="100" />
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
              <label htmlFor="profile-image-form">Slika profila:</label>
              <input
                type="file"
                id="profile-image-form"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <button type="submit">Spremi promjene</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
