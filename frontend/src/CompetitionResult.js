import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompetitionResult = () => {
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // Za prikaz učitavanja
  const [error, setError] = useState(null); // Za greške prilikom učitavanja
  const token = localStorage.getItem('token'); // Token za autorizaciju

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true); // Pokreni učitavanje
        const response = await axios.get('http://localhost:5000/api/rezultati', {
          headers: {
            Authorization: `Bearer ${token}`, // Slanje tokena u headeru za autentifikaciju
          },
        });
        setResults(response.data); // Postavljanje rezultata
        setLoading(false); // Završi učitavanje
      } catch (error) {
        setLoading(false); // Završi učitavanje
        setError('Error fetching competition results'); // Postavljanje greške
        console.error('Error fetching competition results:', error);
      }
    };

    fetchResults();
  }, [token]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtriranje rezultata prema imenu ili prezimenu
  const filteredResults = results.filter(result =>
    result.ime.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.prezime.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sortiranje rezultata po bodovima (od najvećeg do najmanjeg)
  const sortedResults = filteredResults.sort((a, b) => b.bodovi - a.bodovi);

  if (loading) {
    return <p>Učitavanje rezultata...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="competition-result">
      <h1>Rezultati Natječaja</h1>
      <input
        type="text"
        placeholder="Pretraži studente..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      {sortedResults.length === 0 ? (
        <p>Nema rezultata koji odgovaraju pretrazi.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Ime Studenta</th>
              <th>Prezime Studenta</th>
              <th>Email</th>
              <th>Bodovi</th>
              <th>Poredak</th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.map((result, index) => (
              <tr key={result.id}>
                <td>{result.ime}</td>
                <td>{result.prezime}</td>
                <td>{result.email}</td>
                <td>{result.bodovi}</td>
                <td>{index + 1}</td> {/* Poredak se može izračunati na temelju bodova */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CompetitionResult;
