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
  const [university, setUniversities] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({}); // Store validation errors
  const [isDeleting, setIsDeleting] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
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
        setAddress(user.adresa || '');
        setOib(user.oib || '');
        setPhone(user.telefon || '');
        setUniversities(user.sveuciliste || 'Nema');
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const handleSave = async (event) => {
    event.preventDefault();

    // Validate input fields
    let formErrors = {};
    if (!firstName) formErrors.firstName = 'Ime je obavezno.';
    if (!lastName) formErrors.lastName = 'Prezime je obavezno.';
    if (!email) {
      formErrors.email = 'E-mail je obavezan.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = 'Unesite ispravan email.';
    }
    if (!address) formErrors.address = 'Adresa je obavezna.';
    if (!oib) formErrors.oib = 'OIB je obavezan.';
    if (!phone) formErrors.phone = 'Telefon je obavezan.';
    if (!university) formErrors.university = 'Sveučilište je obavezno.';

    setErrors(formErrors);

    // If no errors, send the data to the backend
    if (Object.keys(formErrors).length === 0) {
      try {
        const updatedUser = {
          ime: firstName,
          prezime: lastName,
          email,
          adresa: address,
          oib,
          telefon: phone,
          sveuciliste: university,
        };
        const response = await axios.put('http://localhost:5000/api/users/me', updatedUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('User profile updated:', response.data);
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating user profile:', error);
      }
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
        console.log(response.data.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/'; // Redirect to home after deletion
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
            <span>{address || 'Nema adrese'}</span>
          </div>
          <div>
            <label>OIB:</label>
            <span>{oib || 'Nema OIB'}</span>
          </div>
          <div>
            <label>Telefon:</label>
            <span>{phone || 'Nema telefona'}</span>
          </div>
          <div>
            <label>Sveučilište:</label>
            <span>{university || 'Nema sveučilište'}</span>
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
              {errors.firstName && <p className="error">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="last-name-form">Prezime:</label>
              <input
                type="text"
                id="last-name-form"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && <p className="error">{errors.lastName}</p>}
            </div>
            <div>
              <label htmlFor="email-form">E-mail:</label>
              <input
                type="email"
                id="email-form"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="address-form">Adresa:</label>
              <input
                type="text"
                id="address-form"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && <p className="error">{errors.address}</p>}
            </div>
            <div>
              <label htmlFor="oib-form">OIB:</label>
              <input
                type="text"
                id="oib-form"
                value={oib}
                onChange={(e) => setOib(e.target.value)}
              />
              {errors.oib && <p className="error">{errors.oib}</p>}
            </div>
            <div>
              <label htmlFor="phone-form">Telefon:</label>
              <input
                type="text"
                id="phone-form"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <p className="error">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="university-form">Sveučilište:</label>
              <input
                type="text"
                id="university-form"
                value={university}
                onChange={(e) => setUniversities(e.target.value)}
              />
              {errors.university && <p className="error">{errors.university}</p>}
            </div>
            <button type="submit">Spremi promjene</button>
            <button type="button" onClick={() => setIsEditing(false)}>Odustani</button>
          </form>
        </div>
      )}

      <div className="delete-button-container">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          style={{ backgroundColor: isDeleting ? 'gray' : 'red', cursor: isDeleting ? 'not-allowed' : 'pointer' }}
        >
          {isDeleting ? 'Brisanje...' : 'Izbriši profil'}
        </button>
      </div>
    </div>
  );
};

export default Profile;
