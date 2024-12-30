import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("Fetched user from localStorage:", user);

    if (user) {
      setFirstName(user.ime || "Nema"); // Koristi 'ime' umjesto 'firstName'
      setLastName(user.prezime || "Nema prezimena"); // Koristi 'prezime' umjesto 'lastName'
      setEmail(user.email || "Nema emaila");
      setProfileImage(user.profileImage || "profile-placeholder.png");
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (event) => {
    event.preventDefault();
    const updatedUser = { ime: firstName, prezime: lastName, email, profileImage }; // Koristi 'ime' i 'prezime'
    localStorage.setItem("user", JSON.stringify(updatedUser));
    console.log("User saved to localStorage:", updatedUser);
    setIsEditing(false);
  };

  return (
    <div className="profile-section">
      <div className="display-section">
        <img src={profileImage || "profile-placeholder.png"} alt="Profile" width="100" />
        <div className="profile-details">
          <div>
            <label>Ime:</label>
            <span>{firstName}</span> {/* Prikazuj 'ime' */}
          </div>
          <div>
            <label>Prezime:</label>
            <span>{lastName}</span> {/* Prikazuj 'prezime' */}
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
          </form>
        </div>
      )}
    </div>
  );
}

export default Profile;
