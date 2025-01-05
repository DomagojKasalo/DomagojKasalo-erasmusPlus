import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddCompetitionForm from './AddCompetitionForm';
import './Competition.css';

const Competition = () => {
  const [competitions, setCompetitions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});

  // Filter settings
  const [isOpenOnly, setIsOpenOnly] = useState(false);
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    if (token) {
      const fetchUserRole = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const uloga = response.data && response.data.uloga ? response.data.uloga.toLowerCase() : 'guest';
          setUserRole(uloga);
        } catch (error) {
          console.error('Greška pri dohvaćanju korisničkih podataka:', error);
          setUserRole('guest');
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

  const handleDeleteCompetition = async (id) => {
    if (window.confirm('Jesi li siguran da želiš obrisati?')) {
      try {
        await axios.delete(`http://localhost:5000/api/natjecaji/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompetitions(competitions.filter(comp => comp._id !== id));
        alert('Natječaj je uspješno obrisan.');
      } catch (error) {
        console.error('Greška pri brisanju natječaja:', error);
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

    setFormErrors({});

    const errors = {};
    console.log('Updating competition:', selectedCompetition);

    if (!selectedCompetition.naziv) errors.naziv = 'Naziv ne smije biti prazan.';
    if (!selectedCompetition.opis) errors.opis = 'Opis ne smije biti prazan.';
    if (!selectedCompetition.vrsta_natjecaja) errors.vrsta_natjecaja = 'Vrsta natječaja ne smije biti prazna.';
    if (!selectedCompetition.rok_prijave) {
      errors.rok_prijave = 'Rok prijave ne smije biti prazan.';
    } else {
      const currentDate = new Date();
      const selectedDate = new Date(selectedCompetition.rok_prijave);
      if (selectedDate < currentDate) {
        errors.rok_prijave = 'Datum prijave je u prošlosti.';
      }
    }

    if (!selectedCompetition.status_natjecaja) {
      errors.status_natjecaja = 'Status natječaja ne smije biti prazan.';
    } else if (!['otvoren', 'zatvoren'].includes(selectedCompetition.status_natjecaja)) {
      errors.status_natjecaja = 'Status natječaja mora biti "otvoren" ili "zatvoren".';
    }
    
    console.log('Errors:', errors);


    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const updatedCompetition = {
      naziv: selectedCompetition.naziv,
      opis: selectedCompetition.opis,
      rok_prijave: selectedCompetition.rok_prijave,
      vrsta_natjecaja: selectedCompetition.vrsta_natjecaja,
      status_natjecaja: selectedCompetition.status_natjecaja,
    };

    console.log('Updated competition:', updatedCompetition);


    try {
      await axios.put(`http://localhost:5000/api/natjecaji/${selectedCompetition._id}`, updatedCompetition, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompetitions(competitions.map(comp => comp._id === selectedCompetition._id ? selectedCompetition : comp));
      setIsEditing(false);
      alert('Natječaj je uspješno ažuriran.');
    } catch (error) {
      console.error('Greška pri ažuriranju natječaja:', error);
      alert('Greška pri ažuriranju natječaja.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedCompetition({ ...selectedCompetition, [name]: value });
  };

  const handleResetFilter = () => {
    setSearchQuery('');
    setSearchDate('');
    setIsOpenOnly(false);
  };

  const filteredCompetitions = competitions.filter(competition => {
    let matchesSearchQuery = competition.naziv.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesDate = true;
    if (searchDate) {
      const compDate = new Date(competition.rok_prijave);
      const filterDate = new Date(searchDate);
      matchesDate = compDate >= filterDate;
    }
    let matchesStatus = true;
    if (isOpenOnly) {
      matchesStatus = competition.status_natjecaja === 'otvoren';
    }
    return matchesSearchQuery && matchesDate && matchesStatus;
  });

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

      <div className="filters">
        {userRole === 'student' || userRole === 'nastavnik' ? (
          <>
            <div>
              <label htmlFor="searchDate">Pretraži po datumu:</label>
              <input
                type="date"
                id="searchDate"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </div>
            <div className="checkbox-container">
              <label htmlFor="openOnly">Prikazuj samo otvorene:</label>
              <input
                type="checkbox"
                id="openOnly"
                checked={isOpenOnly}
                onChange={() => setIsOpenOnly(!isOpenOnly)}
              />
            </div>
            <div>
              <button onClick={handleResetFilter}>Ponisti filtere</button>
            </div>
          </>
        ) : null}
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
                <p>Status: {competition.status_natjecaja}</p>
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
              {formErrors.naziv && <p className="error">{formErrors.naziv}</p>}
            </div>
            <div>
              <label htmlFor="opis">Opis:</label>
              <textarea
                id="opis"
                name="opis"
                value={selectedCompetition.opis}
                onChange={handleChange}
              />
              {formErrors.opis && <p className="error">{formErrors.opis}</p>}
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
              {formErrors.rok_prijave && <p className="error">{formErrors.rok_prijave}</p>}
            </div>
            <div>
              <label htmlFor="vrsta_natjecaja">Vrsta natječaja:</label>
              <input
                type="text"
                id="vrsta_natjecaja"
                name="vrsta_natjecaja"
                value={selectedCompetition.vrsta_natjecaja}
                onChange={handleChange}
              />
              {formErrors.vrsta_natjecaja && <p className="error">{formErrors.vrsta_natjecaja}</p>}
            </div>
            <div>
              <label htmlFor="status_natjecaja">Status:</label>
              <select
                id="status_natjecaja"
                name="status_natjecaja"
                value={selectedCompetition.status_natjecaja}
                onChange={handleChange}
              >
                <option value="otvoren">Otvoren</option>
                <option value="zatvoren">Zatvoren</option>
              </select>
              {formErrors.status_natjecaja && <p className="error">{formErrors.status_natjecaja}</p>}
            </div>
            <div>
              <button type="submit">Spremi</button>
              <button type="button" onClick={() => setIsEditing(false)}>Odustani</button>
            </div>
          </form>
        </div>
      )}

      {showForm && (
        <AddCompetitionForm onAddCompetition={handleAddCompetition} />
      )}
    </div>
  );
};

export default Competition;
