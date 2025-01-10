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
  const [userApplications, setUserApplications] = useState([]);


  // Filter settings
  const [isOpenOnly, setIsOpenOnly] = useState(false);
  const [isClosedOnly, setIsClosedOnly] = useState(false);
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

  // Handle deleting a competition
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

  // Handle adding a competition
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

  // Handle updating a competition
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Ako je polje datum, pretvorite ga u ispravan format
    if (name === 'rok_prijave') {
      const newDate = new Date(value);
      setSelectedCompetition({ ...selectedCompetition, [name]: newDate.toISOString().split('T')[0] });
    } else {
      setSelectedCompetition({ ...selectedCompetition, [name]: value });
    }
  };
  

  // Reset filters
  const handleResetFilter = () => {
    setSearchQuery('');
    setSearchDate('');
    setIsOpenOnly(false);
    setIsClosedOnly(false);
  };

  // Filter competitions based on search and other filters
  const filteredCompetitions = competitions.filter((competition) => {
    const matchesSearchQuery = competition.naziv.toLowerCase().includes(searchQuery.toLowerCase());
  
    let matchesDate = true;
    if (searchDate) {
      // Pretvaramo rok_prijave u Date objekt i uspoređujemo s traženim datumom
      const compDate = new Date(competition.rok_prijave).toISOString().split('T')[0];
      matchesDate = compDate === searchDate;
    }
  
    let matchesStatus = true;
    if (isOpenOnly) {
      matchesStatus = competition.status_natjecaja === 'otvoren';
    }

    if (isClosedOnly) {
      matchesStatus = competition.status_natjecaja === 'zatvoren';
    }
  
    return matchesSearchQuery && matchesDate && matchesStatus;
  });
  
  const handleApplyForCompetition = async (natjecaj_id) => {
    try {
      console.log("Natjecaj ID koji šaljete:", natjecaj_id);
      const response = await axios.post(
        `http://localhost:5000/api/prijave/`,  // promijenjena putanja
        { natjecaj_id: natjecaj_id },         // šaljemo natjecaj_id
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Odgovor sa servera:', response);
      setUserApplications([...userApplications, { natjecajId: natjecaj_id }]); // Ovdje ispisujemo odgovor sa servera
      alert('Uspješno ste se prijavili na natječaj!');
    } catch (error) {
      console.error('Greška pri prijavi na natječaj:', error);
      if (error.response) {
        console.error('Podaci odgovora:', error.response.data);  // Ovdje ispisujemo odgovor s greškom
      }
      alert('Greška pri prijavi na natječaj.');
    }
  };
  
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
  {/* Filters for student and nastavnik */}
  {(userRole === 'student' || userRole === 'nastavnik') && (
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
  )}

  {/* Filters for admin */}
  {userRole === 'admin' && (
    <>
      <div className="checkbox-container">
        <label htmlFor="closedOnly">Prikazuj samo zatvorene:</label>
        <input
          type="checkbox"
          id="closedOnly"
          checked={isClosedOnly}
          onChange={() => setIsClosedOnly(!isClosedOnly)}
        />
      </div>
      <div>
        <button onClick={handleResetFilter}>Ponisti filtere</button>
      </div>
    </>
  )}
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
      filteredCompetitions.map((competition) => {
        const currentDate = new Date();
        const applicationDeadline = new Date(competition.rok_prijave);

        if (applicationDeadline < currentDate) {
          competition.status_natjecaja = 'zatvoren';
        }

        return (
          <div key={competition._id} className="competition-item">
            <h2>{competition.naziv}</h2>
            <p>Opis: {competition.opis}</p>
            <p>Rok prijave: {competition.rok_prijave}</p>
            <p>Status: {competition.status_natjecaja}</p>
            <p>Vrsta natječaja: {competition.vrsta_natjecaja}</p>
            {userRole === 'admin' && (
              <>
                <button onClick={() => { setSelectedCompetition(competition); setIsEditing(true); }}>Uredi</button>
                <button onClick={() => handleDeleteCompetition(competition._id)}>Briši</button>
              </>
            )}

            {userRole === 'student' && (
              competition.status_natjecaja === 'otvoren' && applicationDeadline >= currentDate ? (
                <button onClick={() => handleApplyForCompetition(competition._id)}>
                  Prijava
                </button>
              ) : (
                <p className="expired-message">Nažalost, rok za prijavu je prošao.</p>
              )
            )}
          </div>
        );
      })
    ) : (
      <p>No competitions found</p>
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
        <AddCompetitionForm 
          setShowForm={setShowForm} // Prosljeđivanje funkcije
          onAddCompetition={handleAddCompetition} 
        />
      )}
    </div>
  );
};

export default Competition;
