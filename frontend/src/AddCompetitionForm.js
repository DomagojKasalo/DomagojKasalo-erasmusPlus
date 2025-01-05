import React, { useState } from 'react';

const AddCompetitionForm = ({ setShowForm, onAddCompetition }) => {
  const [naziv, setNaziv] = useState('');
  const [opis, setOpis] = useState('');
  const [vrstaNatjecaja, setVrstaNatjecaja] = useState('');
  const [rokPrijave, setRokPrijave] = useState('');
  const [statusNatjecaja, setStatusNatjecaja] = useState('otvoren'); // Default to 'otvoren'
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation object to hold errors
    const validationErrors = {};

    // Validation checks
    if (!naziv) {
      validationErrors.naziv = 'Naziv ne smije biti prazan.';
    }

    if (!opis) {
      validationErrors.opis = 'Opis ne smije biti prazan.';
    }

    if (!vrstaNatjecaja) {
      validationErrors.vrstaNatjecaja = 'Vrsta natječaja ne smije biti prazna.';
    }

    if (!rokPrijave) {
      validationErrors.rokPrijave = 'Rok prijave ne smije biti prazan.';
    } else {
      // Check if the date is in the past
      const currentDate = new Date();
      const selectedDate = new Date(rokPrijave);
      if (selectedDate < currentDate) {
        validationErrors.rokPrijave = 'Rok prijave ne može biti u prošlosti!';
      }
    }

    if (!statusNatjecaja) {
      validationErrors.statusNatjecaja = 'Status natječaja ne smije biti prazan.';
    }

    // If there are validation errors, set the error state
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Don't submit if there are errors
    }

    const newCompetition = {
      naziv,
      opis,
      vrsta_natjecaja: vrstaNatjecaja,
      rok_prijave: rokPrijave,
      status_natjecaja: statusNatjecaja, // Add status to the data
    };

    try {
      await onAddCompetition(newCompetition);
      
      // Close the form after successful submission
      setShowForm(false);
    } catch (error) {
      console.error('Error creating competition:', error);
    }
  };

  return (
    <div className="add-competition-form">
      <h2>Dodaj novi natječaj</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="naziv">Naziv:</label>
          <input
            type="text"
            id="naziv"
            value={naziv}
            onChange={(e) => setNaziv(e.target.value)}
          />
          {errors.naziv && <div style={{ color: 'red' }}>{errors.naziv}</div>}
        </div>
        <div>
          <label htmlFor="opis">Opis:</label>
          <textarea
            id="opis"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
          />
          {errors.opis && <div style={{ color: 'red' }}>{errors.opis}</div>}
        </div>
        <div>
          <label htmlFor="vrstaNatjecaja">Vrsta natječaja:</label>
          <input
            type="text"
            id="vrstaNatjecaja"
            value={vrstaNatjecaja}
            onChange={(e) => setVrstaNatjecaja(e.target.value)}
          />
          {errors.vrstaNatjecaja && <div style={{ color: 'red' }}>{errors.vrstaNatjecaja}</div>}
        </div>
        <div>
          <label htmlFor="rokPrijave">Rok prijave:</label>
          <input
            type="date"
            id="rokPrijave"
            value={rokPrijave}
            onChange={(e) => setRokPrijave(e.target.value)}
          />
          {errors.rokPrijave && <div style={{ color: 'red' }}>{errors.rokPrijave}</div>}
        </div>
        <div>
          <label htmlFor="statusNatjecaja">Status natječaja:</label>
          <select
            id="statusNatjecaja"
            value={statusNatjecaja}
            onChange={(e) => setStatusNatjecaja(e.target.value)}
          >
            <option value="otvoren">Otvoren</option>
            <option value="zatvoren">Zatvoren</option>
          </select>
          {errors.statusNatjecaja && <div style={{ color: 'red' }}>{errors.statusNatjecaja}</div>}
        </div>

        <button type="submit">Spremi</button>
        <button type="button" onClick={() => setShowForm(false)}>Odustani</button>
      </form>
    </div>
  );
};

export default AddCompetitionForm;
