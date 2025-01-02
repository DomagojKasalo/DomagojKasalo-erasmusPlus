import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Dohvaćanje korisničkih podataka iz localStorage svaki put kad se komponenta učita
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Fetched user from localStorage:', user);

    if (user) {
      setFirstName(user.ime || 'Nema');
      setLastName(user.prezime || 'Nema prezimena');
      setEmail(user.email || 'Nema emaila');
      setProfileImage(user.profileImage || 'profile-placeholder.png');
    }
  }, []); // Ovo se izvršava samo pri prvom renderiranju komponente

  const handleEdit = () => {
    setIsEditing(true);
  };

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

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ime: firstName,
          prezime: lastName,
          email,
          profileImage,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
  
      const updatedUser = await response.json();
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Ažuriraj podatke u localStorage
      console.log('Profile updated successfully:', updatedUser);
  
      // Provjera i ažuriranje uloge korisnika ako je potrebno
      if (updatedUser.role) {
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Ažuriranje role ako je promijenjena
      }
  
    } catch (error) {
      console.error('Error updating profile:', error.message);
    }
  };
  

  const handleSave = async (event) => {
    event.preventDefault();
    await updateProfile(); // Ažuriraj podatke na backendu
    setIsEditing(false);

    // Ovdje odmah pohranjujemo promijenjene podatke u localStorage
    const updatedUser = {
      ime: firstName,
      prezime: lastName,
      email,
      profileImage,
    };
    localStorage.setItem('user', JSON.stringify(updatedUser)); // Spremanje promjena u localStorage
  };

  const handleLogout = async () => {
    await updateProfile(); // Spremi promjene prije odjave
    localStorage.removeItem('token'); // Ukloni samo token
    localStorage.removeItem('user'); // Ukloni korisničke podatke iz localStorage
    navigate('/login'); // Preusmjeri na stranicu za prijavu
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
            <button onClick={handleEdit}>Uredi</button>
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
            <button type="button" onClick={handleLogout} className="logout-button">
              Odjava
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
