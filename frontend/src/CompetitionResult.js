import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CompetitionResult.css';

const CompetitionResult = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rezultati', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResults(response.data);
        setLoading(false);
      } catch (error) {
        setError('Greška pri dohvaćanju rezultata');
        setLoading(false);
      }
    };

    fetchResults();
  }, [token]);

  if (loading) {
    return <p>Učitavanje rezultata...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="competition-results">
      <h1>Rezultati natječaja</h1>
      {results.length === 0 ? (
        <p>Nema rezultata za studente sa odobrenim prijavama.</p>
      ) : (
        <table className="results-table">
          <thead>
            <tr>
              <th>ID korisnika</th>
              <th>Bodovi</th>
              <th>Status prijave</th>
              
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>

                <td>{result.id_prijave.korisnik_id}</td>
                <td>{result.bodovi}</td>
                <td>{result.id_prijave.status_prijave}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CompetitionResult;
