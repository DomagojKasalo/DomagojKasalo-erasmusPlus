import React, { useState } from 'react';

const AddSchoolForm = ({ setShowForm, onAddUniversity }) => {
  const [naziv, setNaziv] = useState('');
  const [adresa, setAdresa] = useState('');
  const [email, setEmail] = useState('');
  const [kontaktTelefon, setKontaktTelefon] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUniversity = {
      naziv,
      adresa,
      email,
      kontakt_telefon: kontaktTelefon,
    };

    try {
      await onAddUniversity(newUniversity);
      setShowForm(false); // Zatvori formu nakon uspješnog dodavanja
    } catch (error) {
      console.error('Greška prilikom dodavanja sveučilišta:', error);
    }
  };

  return (
    <div className="add-competition-form">
      <h2>Dodaj novo sveučilište</h2>
      <form onSubmit={handleSubmit}>
        {/* Naziv Sveučilišta */}
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

        {/* Adresa */}
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

        {/* Email */}
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

        {/* Kontakt Telefon */}
        <div className="form-group">
          <label htmlFor="kontaktTelefon">Kontakt Telefon:</label>
          <input
            type="text"
            id="kontaktTelefon"
            value={kontaktTelefon}
            onChange={(e) => setKontaktTelefon(e.target.value)}
          />
        </div>

        {/* botuni */}
        <div className="form-buttons">
          <button type="submit" className="button-left">Spremi</button>
          <button type="button" className="button-right" onClick={() => setShowForm(false)}>
            Odustani
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSchoolForm;
