import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserPage.css';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [isEditing, setIsEditing] = useState(false); 
  const [formErrors, setFormErrors] = useState({
    ime: "",
    prezime: "",
    email: "",
    uloga: "",
  }); // Errors for each field
  const [error, setError] = useState(""); // For displaying global errors
  const token = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching data from backend');
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Backend response:', response.data); 
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
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
        console.error('Error deleting user:', error);
        alert('Greška pri brisanju korisnika.');
      }
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    let validationErrors = {
      ime: "",
      prezime: "",
      email: "",
      uloga: "",
    };

    let isValid = true;

    // Validation
    if (!selectedUser.ime) {
      validationErrors.ime = "Ime je obavezno.";
      isValid = false;
    }
    if (!selectedUser.prezime) {
      validationErrors.prezime = "Prezime je obavezno.";
      isValid = false;
    }
    if (!selectedUser.email || !/\S+@\S+\.\S+/.test(selectedUser.email)) {
      validationErrors.email = "Unesite ispravan email.";
      isValid = false;
    }
    if (!selectedUser.uloga) {
      validationErrors.uloga = "Uloga je obavezna.";
      isValid = false;
    }

    if (!isValid) {
      setFormErrors(validationErrors);
      return; // Stop updating if there are errors
    }

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
      setIsEditing(false); // Close form after successful update
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Greška pri ažuriranju korisnika.');
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

      {error && <div className="error-message">{error}</div>} {/* Show global error messages */}

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
              {formErrors.ime && <p className="error">{formErrors.ime}</p>}
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
              {formErrors.prezime && <p className="error">{formErrors.prezime}</p>}
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
              {formErrors.email && <p className="error">{formErrors.email}</p>}
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
              {formErrors.uloga && <p className="error">{formErrors.uloga}</p>}
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
