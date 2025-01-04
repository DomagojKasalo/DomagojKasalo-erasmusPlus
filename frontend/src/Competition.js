import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddCompetitionForm from './AddCompetitionForm';
import './Competition.css';

const Competition = () => {
  const [competitions, setCompetitions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState(null); // Držimo stanje za ulogu
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const fetchUserRole = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Provjera strukture odgovora
          console.log('Odgovor API-ja:', response.data);

          // Promijeniti 'role' u 'uloga'
          const uloga = response.data && response.data.uloga ? response.data.uloga.toLowerCase() : 'guest';
          setUserRole(uloga);
        } catch (error) {
          console.error('Greška pri dohvaćanju korisničkih podataka:', error);
          setUserRole('guest'); // Pretpostavljena vrijednost ako API ne uspije
        }
      };

      const fetchCompetitions = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/natjecaji', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCompetitions(response.data);
        } catch (error) {
          console.error('Greška pri dohvaćanju natječaja:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserRole();
      fetchCompetitions();
    }
  }, [token]);

  if (userRole === null) {
    return <p>Učitavam podatke...</p>; // Loader dok se uloga učitava
  }

  const handleDeleteCompetition = async (id) => {
    if (window.confirm('Jesi li siguran da želiš obrisati?')) {
      try {
        await axios.delete(`http://localhost:5000/api/natjecaji/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompetitions(competitions.filter(comp => comp._id !== id));
        alert('Natječaj je uspješno obrisan.');
      } catch (error) {
        console.error('Error deleting competition:', error);
        alert('Greška pri brisanju natječaja.');
      }
    }
  };

  const handleAddCompetition = async (newCompetition) => {
    try {
      const response = await axios.post('http://localhost:5000/api/natjecaji', newCompetition, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompetitions((prevCompetitions) => [...prevCompetitions, response.data]);
      setShowForm(false);
      alert('Natječaj je uspješno dodan.');
    } catch (error) {
      alert('Greška pri dodavanju natječaja.');
      console.error('Error adding competition:', error);
    }
  };

  const handleUpdateCompetition = async (event) => {
    event.preventDefault();
    const updatedCompetition = {
      naziv: selectedCompetition.naziv,
      opis: selectedCompetition.opis,
      rok_prijave: selectedCompetition.rok_prijave,
      vrsta_natjecaja: selectedCompetition.vrsta_natjecaja,
    };

    try {
      await axios.put(`http://localhost:5000/api/natjecaji/${selectedCompetition._id}`, updatedCompetition, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompetitions(competitions.map(comp => comp._id === selectedCompetition._id ? selectedCompetition : comp));
      setIsEditing(false);
      alert('Natječaj je uspješno ažuriran.');
    } catch (error) {
      console.error('Error updating competition:', error);
      alert('Greška pri ažuriranju natječaja.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedCompetition({ ...selectedCompetition, [name]: value });
  };

  const filteredCompetitions = competitions.filter(competition =>
    competition.naziv.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="competitions-section">
      <div className="header">
        <h1>Popis natječaja</h1>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Pretraži..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {userRole === 'admin' && (
        <div className="add-competition-btn">
          <button onClick={() => setShowForm(true)}>Dodaj novi natječaj</button>
        </div>
      )}

      {isLoading ? (
        <p>Učitavam natječaje...</p>
      ) : (
        <div className="competitions-list">
          {filteredCompetitions.length > 0 ? (
            filteredCompetitions.map((competition) => (
              <div key={competition._id} className="competition-item">
                <h2>{competition.naziv}</h2>
                <p>Opis: {competition.opis}</p>
                <p>Rok prijave: {competition.rok_prijave}</p>
                {userRole === 'admin' && (
                  <>
                    <button onClick={() => { setSelectedCompetition(competition); setIsEditing(true); }}>Uredi</button>
                    <button onClick={() => handleDeleteCompetition(competition._id)}>Briši</button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>Nema natječaja.</p>
          )}
        </div>
      )}

      {isEditing && selectedCompetition && (
        <div className="edit-section">
          <h2>Uredi natječaj</h2>
          <form onSubmit={handleUpdateCompetition}>
            <div>
              <label htmlFor="naziv">Naziv:</label>
              <input
                type="text"
                id="naziv"
                name="naziv"
                value={selectedCompetition.naziv}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="opis">Opis:</label>
              <textarea
                id="opis"
                name="opis"
                value={selectedCompetition.opis}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="rok_prijave">Rok prijave:</label>
              <input
                type="date"
                id="rok_prijave"
                name="rok_prijave"
                value={selectedCompetition.rok_prijave}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="vrsta_natjecaja">Vrsta natječaja:</label>
              <input
                type="text"
                id="vrsta_natjecaja"
                name="vrsta_natjecaja"
                value={selectedCompetition.vrsta_natjecaja || ''}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Spremi</button>
            <button type="button" onClick={() => setIsEditing(false)}>Odustani</button>
          </form>
        </div>
      )}

      {showForm && (
        <AddCompetitionForm
          setShowForm={setShowForm}
          onAddCompetition={handleAddCompetition}
        />
      )}
    </div>
  );
};

export default Competition;
