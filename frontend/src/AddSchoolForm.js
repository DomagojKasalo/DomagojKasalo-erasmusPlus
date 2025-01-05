import React, { useState, useEffect } from 'react';

const AddSchoolForm = ({ setShowForm, onAddUniversity, onUpdateUniversity, university }) => {
  const [naziv, setNaziv] = useState('');
  const [adresa, setAdresa] = useState('');
  const [email, setEmail] = useState('');
  const [kontaktTelefon, setKontaktTelefon] = useState('');

  useEffect(() => {
    if (university) {
      setNaziv(university.naziv);
      setAdresa(university.adresa);
      setEmail(university.email);
      setKontaktTelefon(university.telefon);
      console.log(university.telefon)
    }
  }, [university]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUniversity = {
      naziv,
      adresa,
      email,
      telefon: kontaktTelefon,
    };

    if (university) {
      // Editing an existing university
      await onUpdateUniversity({ ...newUniversity, _id: university._id });
    } else {
      // Adding a new university
      await onAddUniversity(newUniversity);
    }
  };

  return (
    <div className="add-competition-form">
      <h2>{university ? 'Uredi Sveučilište' : 'Dodaj novo sveučilište'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="naziv">Naziv Sveučilišta:</label>
          <input
            type="text"
            id="naziv"
            value={naziv}
            onChange={(e) => setNaziv(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="adresa">Adresa:</label>
          <input
            type="text"
            id="adresa"
            value={adresa}
            onChange={(e) => setAdresa(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="kontaktTelefon">Kontakt Telefon:</label>
          <input
            type="text"
            id="kontaktTelefon"
            value={kontaktTelefon}
            onChange={(e) => setKontaktTelefon(e.target.value)}
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="button-left">{university ? 'Spremi' : 'Dodaj'}</button>
          <button type="button" className="button-right" onClick={() => setShowForm(false)}>
            Odustani
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSchoolForm;
