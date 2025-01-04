import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserPage.css';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [isEditing, setIsEditing] = useState(false); 
  const token = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Poslano na backend');
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Odgovor s backenda:', response.data); 
        setUsers(response.data);
      } catch (error) {
        console.error('Greška pri dohvaćanju korisnika:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleDelete = async (userId) => {
    if (window.confirm('Jeste li sigurni da želite izbrisati ovog korisnika?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter(user => user._id !== userId));
        alert('Korisnik je uspješno izbrisan.');
      } catch (error) {
        console.error('Greška pri brisanju korisnika:', error);
        alert('Greška pri brisanju korisnika.');
      }
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const updatedUser = {
      ime: selectedUser.ime,
      prezime: selectedUser.prezime,
      email: selectedUser.email,
      uloga: selectedUser.uloga,
    };

    try {
      await axios.put(`http://localhost:5000/api/users/${selectedUser._id}`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map(user => user._id === selectedUser._id ? selectedUser : user));
      alert('Korisnik je uspješno ažuriran.');
      setIsEditing(false); // Zatvori formu nakon uspješne promjene
    } catch (error) {
      console.error('Greška pri ažuriranju korisnika:', error);
      alert('Greška pri ažuriranju korisnika.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  return (
    <div className="users-page">
      <h1>Popis korisnika</h1>
      {isLoading ? (
        <p>Učitavanje korisnika...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Ime</th>
              <th>Email</th>
              <th>Uloga</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.ime} {user.prezime}</td>
                  <td>{user.email}</td>
                  <td>{user.uloga}</td>
                  <td>
                    <button onClick={() => { setSelectedUser(user); setIsEditing(true); }}>Uredi</button>
                    <button onClick={() => handleDelete(user._id)}>Izbriši</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Nema korisnika za prikaz.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {isEditing && selectedUser && (
        <div className="edit-section">
          <h2>Uredi korisnika</h2>
          <form onSubmit={handleUpdate}>
            <div>
              <label htmlFor="ime">Ime:</label>
              <input
                type="text"
                id="ime"
                name="ime"
                value={selectedUser.ime}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="prezime">Prezime:</label>
              <input
                type="text"
                id="prezime"
                name="prezime"
                value={selectedUser.prezime}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email">E-mail:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={selectedUser.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="uloga">Uloga:</label>
              <input
                type="text"
                id="uloga"
                name="uloga"
                value={selectedUser.uloga}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Spremi promjene</button>
            <button type="button" onClick={() => setIsEditing(false)}>Odustani</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserPage;
