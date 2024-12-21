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
    if (user) {
      const [first, last] = user.name.split(" ");
      setFirstName(first);
      setLastName(last);
      setEmail(user.email);
      if (user.profileImage) {
        setProfileImage(user.profileImage);
      }
    }
  }, []);

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
    const updatedUser = { name: `${firstName} ${lastName}`, email, profileImage };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  return (
    <div className="profile-section">
      <div className="display-section">
        <img src={profileImage || "profile-placeholder.png"} alt="Profile" width="100" />
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
          </form>
        </div>
      )}
    </div>
  );
}

export default Profile;
