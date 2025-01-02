import React, { useState, useEffect } from 'react';
import AddCompetitionForm from './AddCompetitionForm';
import './Competition.css';

const Competition = () => {
  const [competitions, setCompetitions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/natjecaji');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCompetitions(data);
      } catch (error) {
        console.error('Error fetching competitions:', error);
      }
    };

    fetchCompetitions();

    // Provjera je li korisnik admin - svaki put kada se komponenta učita
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []); // Ponovno dohvaćanje podataka prilikom mounta komponente

  const handleAddCompetition = (newCompetition) => {
    setCompetitions([...competitions, newCompetition]);
    setShowForm(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCompetitions = competitions.filter(competition =>
    competition.naziv.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="competitions-section">
      <div className="header">
        <h1>Popis natječaja</h1>
        {isAdmin && <button onClick={() => setShowForm(true)}>Dodaj novi natječaj</button>}
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Pretraži natječaje..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="competitions-list">
        {filteredCompetitions.map(competition => (
          <div key={competition.id} className="competition-item">
            <h2>Naziv: {competition.naziv}</h2>
            <p>Opis: {competition.opis}</p>
            <p>Rok za prijavu: {competition.rok_prijave}</p>
            <p>Povezanost s sveučilištem: {competition.povezanost}</p>
          </div>
        ))}
      </div>
      {showForm && <AddCompetitionForm setShowForm={setShowForm} onAddCompetition={handleAddCompetition} />}
    </div>
  );
};

export default Competition;
