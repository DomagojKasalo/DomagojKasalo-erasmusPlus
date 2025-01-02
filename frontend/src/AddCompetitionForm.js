import React, { useState } from 'react';
import './AddCompetitionForm.css';

const AddCompetitionForm = ({ setShowForm, onAddCompetition }) => {
  const [naziv, setNaziv] = useState('');
  const [opis, setOpis] = useState('');
  const [rok, setRok] = useState('');
  const [povezanost, setPovezanost] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCompetition = {
      naziv,
      opis,
      rok_prijave: rok, // Ispravno postavljanje 'rok_prijave'
      povezanost,
    };
    onAddCompetition(newCompetition);
  };

  return (
    <div className="edit-section-vertical">
      <form className="edit-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="naziv-form">Naziv:</label>
          <input
            type="text"
            id="naziv-form"
            value={naziv}
            onChange={(e) => setNaziv(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="opis-form">Opis:</label>
          <textarea
            id="opis-form"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="rok-form">Rok za prijavu:</label>
          <input
            type="date"
            id="rok-form"
            value={rok}
            onChange={(e) => setRok(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="povezanost-form">Povezanost s predmetom/sveučilištem:</label>
          <input
            type="text"
            id="povezanost-form"
            value={povezanost}
            onChange={(e) => setPovezanost(e.target.value)}
          />
        </div>
        <div className="form-buttons">
          <button type="submit">Objavi</button>
          <button type="button" onClick={() => setShowForm(false)}>Odustani</button>
        </div>
      </form>
    </div>
  );
};

export default AddCompetitionForm;
