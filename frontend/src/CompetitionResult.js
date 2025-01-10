import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CompetitionResult.css';

const CompetitionResult = () => {
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minBodovi, setMinBodovi] = useState('');
  const [maxBodovi, setMaxBodovi] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dohvati rezultate natječaja
        const resultsResponse = await axios.get('http://localhost:5000/api/rezultati', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(resultsResponse.data);

        // Dohvati korisnike
        const usersResponse = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Mapiraj korisnike prema ID-u
        const userMap = {};
        usersResponse.data.forEach((user) => {
          userMap[user._id] = `${user.ime} ${user.prezime}`;
        });
        setUsers(userMap);
      } catch (error) {
        setError('Greška pri dohvaćanju podataka.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return <p>Učitavanje rezultata...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const allBodovi = results.map((result) => result.bodovi);
  const minAvailableBodovi = Math.min(...allBodovi);
  const maxAvailableBodovi = Math.max(...allBodovi);

  const bodoviOptions = [];
  for (let i = minAvailableBodovi; i <= maxAvailableBodovi; i++) {
    bodoviOptions.push(i);
  }

  const filteredResults = results.filter((result) => {
    const bodovi = result.bodovi;
    const minCheck = minBodovi ? bodovi >= parseInt(minBodovi, 10) : true;
    const maxCheck = maxBodovi ? bodovi <= parseInt(maxBodovi, 10) : true;
    return minCheck && maxCheck;
  });

  return (
    <div className="competition-results">
      <h1>Rezultati natječaja</h1>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-dropdown">
          <label htmlFor="min-bodovi">Minimalni bodovi:</label>
          <select
            id="min-bodovi"
            value={minBodovi}
            onChange={(e) => setMinBodovi(e.target.value)}
          >
            <option value="">Izaberi minimalne bodove</option>
            {bodoviOptions.map((bod, index) => (
              <option key={index} value={bod}>
                {bod}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-dropdown">
          <label htmlFor="max-bodovi">Maksimalni bodovi:</label>
          <select
            id="max-bodovi"
            value={maxBodovi}
            onChange={(e) => setMaxBodovi(e.target.value)}
          >
            <option value="">Izaberi maksimalne bodove</option>
            {bodoviOptions.map((bod, index) => (
              <option key={index} value={bod}>
                {bod}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <p>Nema rezultata za odabrane kriterije.</p>
      ) : (
        <table className="results-table">
          <thead>
            <tr>
              <th>Korisnik</th>
              <th>Bodovi</th>
              <th>Status prijave</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((result, index) => (
              <tr key={index}>
                <td>{users[result.id_prijave.korisnik_id] || 'Nepoznato ime'}</td>
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
