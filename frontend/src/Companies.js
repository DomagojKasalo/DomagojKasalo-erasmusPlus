import React, { useState, useEffect } from 'react';
import AddCompanyForm from './AddCompanyForm';  // Importiraj novu komponentu
import axios from 'axios';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      const fetchUserRole = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const uloga = response.data?.uloga?.toLowerCase() || 'guest';
          setUserRole(uloga);
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole('guest');
        }
      };

      const fetchCompanies = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/tvrtke', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCompanies(response.data);
        } catch (error) {
          console.error('Error fetching companies:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserRole();
      fetchCompanies();
    }
  }, [token]);

  const handleDeleteCompany = async (id) => {
    if (window.confirm('Jeste li sigurni da želite obrisati ovu tvrtku?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tvrtke/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanies(companies.filter(company => company._id !== id));
        alert('Tvrtka je uspješno obrisana.');
      } catch (error) {
        console.error('Error deleting company:', error);
        alert('Greška brisanja tvrtka.');
      }
    }
  };

  const handleAddCompany = async (newCompany) => {
    try {
      const response = await axios.post('http://localhost:5000/api/tvrtke', newCompany, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies([...companies, response.data]);
      setShowForm(false);
      alert('Tvrtka je uspješno dodana.');
    } catch (error) {
      console.error('Error adding company:', error);
      alert('Greška dodavanja tvrtke.');
    }
  };

  const handleUpdateCompany = async (updatedCompany) => {
    try {
      await axios.put(`http://localhost:5000/api/tvrtke/${updatedCompany._id}`, updatedCompany, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(
        companies.map(company => (company._id === updatedCompany._id ? updatedCompany : company))
      );
      setShowForm(false);
      alert('Tvrtka je uspješno ažurirana.');
    } catch (error) {
      console.error('Error updating company:', error);
      alert('Greška ažuriranja tvrtke.');
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.naziv.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="-section">
      <h1>Popis Tvrtki</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Pretraži..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {userRole === 'admin' && (
        <div className="add-btn">
          <button onClick={() => { setSelectedCompany(null); setShowForm(true); }}>
            Dodaj Tvrtku
          </button>
        </div>
      )}

      {showForm && (
        <AddCompanyForm
          setShowForm={setShowForm}
          onAddCompany={handleAddCompany}
          onUpdateCompany={handleUpdateCompany}
          company={selectedCompany}
        />
      )}
      {isLoading ? (
        <p>Učitavanje tvrtki...</p>
      ) : (
        <div className="-list">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <div key={company._id} className="-item">
                <h2>{company.naziv}</h2>
                <p>Adresa: {company.adresa}</p>
                <p>Email: {company.email}</p>
                <p>Telefon: {company.telefon}</p>
                {userRole === 'admin' && (
                  <>
                    <button onClick={() => { setSelectedCompany(company); setShowForm(true); }}>
                      Uredi
                    </button>
                    <button onClick={() => handleDeleteCompany(company._id)}>Briši</button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>Nema dostupnih tvrtki.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Companies;
