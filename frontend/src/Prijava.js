import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Prijava.css';

const Prijava = () => {
  const [competitions, setCompetitions] = useState([]);
  const [prijave, setPrijave] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [formError, setFormError] = useState('');
  const [token] = useState(localStorage.getItem('token'));

  // Fetch competitions, applications, and user role
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/natjecaji', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompetitions(response.data);
      } catch (error) {
        console.error('Error fetching competitions:', error);
      }
    };

    const fetchPrijave = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/prijave', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPrijave(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    const fetchUserRole = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(response.data.uloga);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (token) {
      fetchCompetitions();
      fetchPrijave();
      fetchUserRole();
    }
  }, [token]);

  const handleApply = async (event) => {
    event.preventDefault();
  
    if (!selectedCompetition) {
      setFormError('Please select a competition.');
      return;
    }
  
    try {
      await axios.post(
        'http://localhost:5000/api/prijave',
        { natjecaj_id: selectedCompetition },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Get student data after successful application
      const userResponse = await axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const studentData = userResponse.data;
  
      alert(`Successfully applied to the competition!\nStudent: ${studentData.username}\nCompetition: ${selectedCompetition}`);
      
      setFormError('');
      setSelectedCompetition('');
    } catch (error) {
      setFormError(error.response?.data?.message || 'Error occurred while applying.');
      console.error('Error applying:', error);
    }
  };
  

  const handleStatusUpdate = async (prijavaId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/prijave/${prijavaId}`,
        { status_prijave: status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const statusMessage = status === 'odobreno' ? 'Zahtjev je odobren!' : 'Zahtjev je odbijen!';
      alert(statusMessage);  // Prikazivanje odgovarajuće poruke
  
      setPrijave(prijave.map((prijava) =>
        prijava._id === prijavaId ? { ...prijava, status_prijave: status } : prijava
      ));
    } catch (error) {
      alert('Error updating application status.');
      console.error('Error updating status:', error);
    }
  };
  

  const renderCompetitionsForStudent = () => {
    return competitions.map((competition) => (
      <div key={competition._id} className="competition-item">
        <h2>{competition.naziv}</h2>
        <p>{competition.opis}</p>
        <p>Application deadline: {competition.rok_prijave}</p>
        <button
          onClick={() => setSelectedCompetition(competition._id)}
          disabled={competition.status_natjecaja === 'zatvoren'}
        >
          {competition.status_natjecaja === 'zatvoren' ? 'Competition closed' : 'Apply'}
        </button>
      </div>
    ));
  };

 const renderPrijaveForAdmin = () => {
  return prijave.map((prijava) => (
    <div key={prijava._id} className="prijava-item">
      {prijava.natjecaj_id ? (
        <>
          <h3>{prijava.natjecaj_id.naziv}</h3>
          <p><strong>Student:</strong> {prijava.korisnik_id.ime} {prijava.korisnik_id.prezime}</p> 
          <p><strong>Email:</strong> {prijava.korisnik_id.email}</p>  
          <p><strong>Status:</strong> {prijava.status_prijave}</p> 
        </>
      ) : (
        <p>Competition data not available</p>
      )}
      <div className="status-buttons">
        <button onClick={() => handleStatusUpdate(prijava._id, 'odobreno')}>odobreno</button>
        <button onClick={() => handleStatusUpdate(prijava._id, 'odbijeno')}>odbijeno</button>
      </div>
    </div>
  ));
};

  
  
  

  return (
    <div className="prijava-section">

      {formError && <p className="error">{formError}</p>}

      {userRole === 'student' ? (
        <div className="student-options">
          <h2>Select a competition</h2>
          {renderCompetitionsForStudent()}

          <button onClick={handleApply} disabled={!selectedCompetition}>
            Apply for selected competition
          </button>
        </div>
      ) : userRole === 'admin' ? (
        <div className="admin-options">
          <h2>Prijave korisnika</h2>
          {renderPrijaveForAdmin()}
        </div>
      ) : (
        <div className="guest-options">
          <h2>Prijavljeni korisnici</h2>
        </div>
      )}
    </div>
  );
};

export default Prijava;
