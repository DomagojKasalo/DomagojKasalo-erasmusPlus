import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function Home() {
  const [userName, setUserName] = useState('');
  const [latestCompetitions, setLatestCompetitions] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserName(response.data.ime);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    async function fetchCompetitions() {
      try {
        const response = await axios.get('http://localhost:5000/api/natjecaji', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLatestCompetitions(response.data.slice(0, 3)); // Prikazujemo samo 3 natječaja
      } catch (error) {
        console.error('Error fetching competitions:', error);
      }
    }

    if (token) {
      fetchUserData();
      fetchCompetitions();
    }
  }, [token]);

  return React.createElement(
    'div',
    { className: 'home-container' },
    React.createElement(
      'header',
      { className: 'home-header' },
      React.createElement('h1', null, 'Dobrodošli na našu platformu'),
    ),
    React.createElement(
      'section',
      { className: 'welcome-section' },
      React.createElement('h2', null, `Pozdrav, ${userName}!`)
    ),
    React.createElement(
      'section',
      { className: 'quick-links' },
      React.createElement('h3', null, 'Brzi pristup'),
      React.createElement(
        'div',
        { className: 'links' },
        React.createElement(Link, { to: '/natjecaji', className: 'link-card' }, 'Natječaji'),
        React.createElement(Link, { to: '/profile', className: 'link-card' }, 'Moj Profil'),
      )
    ),
    React.createElement(
      'section',
      { className: 'latest-competitions' },
      React.createElement('h3', null, 'Najnoviji natječaji'),
      latestCompetitions.length > 0
        ? React.createElement(
            'ul',
            null,
            latestCompetitions.map((competition) =>
              React.createElement(
                'li',
                { key: competition._id },
                React.createElement('h4', null, competition.naziv),
                React.createElement('p', null, competition.opis)
              )
            )
          )
        : React.createElement('p', null, 'Nema dostupnih natječaja.')
    )
  );
}

export default Home;
