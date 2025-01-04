import React, { useState } from 'react';

const AddCompetitionForm = ({ setShowForm, onAddCompetition }) => {
  const [naziv, setNaziv] = useState('');
  const [opis, setOpis] = useState('');
  const [vrstaNatjecaja, setVrstaNatjecaja] = useState('');
  const [rokPrijave, setRokPrijave] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCompetition = {
      naziv,
      opis,
      vrsta_natjecaja: vrstaNatjecaja,
      rok_prijave: rokPrijave,
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
        </div>
        <div>
          <label htmlFor="opis">Opis:</label>
          <textarea
            id="opis"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="vrstaNatjecaja">Vrsta natječaja:</label>
          <input
            type="text"
            id="vrstaNatjecaja"
            value={vrstaNatjecaja}
            onChange={(e) => setVrstaNatjecaja(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="rokPrijave">Rok prijave:</label>
          <input
            type="date"
            id="rokPrijave"
            value={rokPrijave}
            onChange={(e) => setRokPrijave(e.target.value)}
          />
        </div>
        
        <button type="submit">Spremi</button>
        <button type="button" onClick={() => setShowForm(false)}>Odustani</button>
      </form>
    </div>
  );
};

export default AddCompetitionForm;
