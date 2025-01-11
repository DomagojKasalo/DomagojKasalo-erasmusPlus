import React, { useState, useEffect } from 'react';
import AddSchoolForm from './AddSchoolForm';
import './School&Companies.css';
import axios from 'axios';

const Schools = () => {
  const [universities, setUniversities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      const fetchUserRole = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const uloga = response.data?.uloga?.toLowerCase() || 'guest';
          setUserRole(uloga);
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole('guest');
        }
      };

      const fetchUniversities = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/sveucilista', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUniversities(response.data);
        } catch (error) {
          console.error('Error fetching universities:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserRole();
      fetchUniversities();
    }
  }, [token]);

  const handleDeleteUniversity = async (id) => {
    if (window.confirm('Jeste li sigurni da želite obrisati ovo sveučilište?')) {
      try {
        await axios.delete(`http://localhost:5000/api/sveucilista/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUniversities(universities.filter(uni => uni._id !== id));
        alert('Sveučilište je uspješno obrisano.');
      } catch (error) {
        console.error('Error deleting university:', error);
        alert('Error deleting university.');
      }
    }
  };

  const handleAddUniversity = async (newUniversity) => {
    try {
      const response = await axios.post('http://localhost:5000/api/sveucilista', newUniversity, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUniversities([...universities, response.data]);
      setShowForm(false);
      alert('Sveučilište je uspješno dodano.');
    } catch (error) {
      console.error('Error adding university:', error);
      alert('Error adding university.');
    }
  };

  const handleUpdateUniversity = async (updatedUniversity) => {
    try {
      await axios.put(`http://localhost:5000/api/sveucilista/${updatedUniversity._id}`, updatedUniversity, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUniversities(
        universities.map(uni => (uni._id === updatedUniversity._id ? updatedUniversity : uni))
      );
      setShowForm(false);
      alert('Sveučilište je uspješno ažurirano.');
    } catch (error) {
      console.error('Error updating university:', error);
      alert('Error updating university.');
    }
  };

  const filteredUniversities = universities.filter(university =>
    university.naziv.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="-section">
      <h1>Popis Sveučilišta</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Pretraži..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {userRole === 'admin' && (
        <div className="add-btn">
          <button onClick={() => { setSelectedUniversity(null); setShowForm(true); }}>
            Dodaj Sveučilište
          </button>
        </div>
      )}

      {showForm && (
        <AddSchoolForm
          setShowForm={setShowForm}
          onAddUniversity={handleAddUniversity}
          onUpdateUniversity={handleUpdateUniversity}
          university={selectedUniversity}
        />
      )}
      {isLoading ? (
        <p>Učitavanje sveučilišta...</p>
      ) : (
        <div className="-list">
          {filteredUniversities.length > 0 ? (
            filteredUniversities.map((university) => (
              <div key={university._id} className="-item">
                <h2>{university.naziv}</h2>
                <p>Adresa: {university.adresa}</p>
                <p>Email: {university.email}</p>
                <p>Telefon: {university.telefon}</p>
                {userRole === 'admin' && (
                  <>
                    <button onClick={() => { setSelectedUniversity(university); setShowForm(true); }}>
                      Uredi
                    </button>
                    <button onClick={() => handleDeleteUniversity(university._id)}>Briši</button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>Nema dostupnih sveučilišta.</p>
          )}
        </div>
      )}

    </div>
  );
};

export default Schools;
