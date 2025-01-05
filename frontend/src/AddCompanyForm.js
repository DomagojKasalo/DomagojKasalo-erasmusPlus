import React, { useState, useEffect } from 'react';

const AddCompanyForm = ({ setShowForm, onAddCompany, onUpdateCompany, company }) => {
  const [naziv, setNaziv] = useState('');
  const [adresa, setAdresa] = useState('');
  const [email, setEmail] = useState('');
  const [kontaktTelefon, setKontaktTelefon] = useState('');

  useEffect(() => {
    if (company) {
      setNaziv(company.naziv);
      setAdresa(company.adresa);
      setEmail(company.email);
      setKontaktTelefon(company.kontakt_telefon);
    }
  }, [company]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCompany = {
      naziv,
      adresa,
      email,
      kontakt_telefon: kontaktTelefon,
    };

    if (company) {
      // Editing an existing company
      await onUpdateCompany({ ...newCompany, _id: company._id });
    } else {
      // Adding a new company
      await onAddCompany(newCompany);
    }
  };

  return (
    <div className="add-competition-form">
      <h2>{company ? 'Uredi Tvrtku' : 'Dodaj novu tvrtku'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="naziv">Naziv Tvrtke:</label>
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
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="button-left">{company ? 'Spremi' : 'Dodaj'}</button>
          <button type="button" className="button-right" onClick={() => setShowForm(false)}>
            Odustani
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCompanyForm;
