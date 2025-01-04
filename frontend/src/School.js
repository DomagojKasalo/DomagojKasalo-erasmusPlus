import React, { useState, useEffect } from 'react';
import AddSchoolForm from './AddSchoolForm';
import './School.css'
import axios from 'axios';

const Schools = () => {
  const [showForm, setShowForm] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch universities when the component mounts
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/sveucilista', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched universities:', response.data); // Check the structure of the data
        setUniversities(response.data); // Assuming response.data is the array of universities
      } catch (error) {
        console.error('Greška pri učitavanju sveučilišta:', error);
        alert('Greška pri učitavanju sveučilišta');
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  const handleAddUniversity = async (newUniversity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/sveucilista', newUniversity, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Sveučilište uspješno dodano!');

      // Fetch updated universities list after adding a new university
      const response = await axios.get('http://localhost:5000/api/sveucilista', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Updated universities list after adding:', response.data);
      setUniversities(response.data);
    } catch (error) {
      console.error('Greška:', error);
      alert('Greška prilikom dodavanja sveučilišta');
    }
  };

  return (
    <div className='schools-section'>
      <h1>Sveučilišta</h1>
        <div className="add-school-btn">
         <button onClick={() => setShowForm(true)}>Dodaj Sveučilište</button>
        </div>
    
      {showForm && (
        <AddSchoolForm
          setShowForm={setShowForm}
          onAddUniversity={handleAddUniversity}
        />
      )}

      {loading ? (
        <p>Učitavanje sveučilišta...</p>
      ) : (
        <div>
          {universities.length > 0 ? (
            <ul>
              {universities.map((university, index) => (
                <li key={index}>
                  <div>
                    <strong>Naziv:</strong> {university.naziv || 'Unnamed University'}
                  </div>
                  <div>
                    <strong>Adresa:</strong> {university.adresa || 'No address provided'}
                  </div>
                  <div>
                    <strong>Email:</strong> {university.email || 'No email provided'}
                  </div>
                  <div>
                    <strong>Created At:</strong> {new Date(university.createdAt).toLocaleString() || 'No date provided'}
                  </div>
                  <div>
                    <strong>Updated At:</strong> {new Date(university.updatedAt).toLocaleString() || 'No date provided'}
                  </div>
                  {/* Add more fields here if needed */}
                </li>
              ))}
            </ul>
          ) : (
            <p>No universities available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Schools;
