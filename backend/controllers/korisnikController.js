const Korisnici = require('../models/Korisnici');
const Svecilista = require('../models/Sveucilista'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const registerUser = async (req, res) => {
  const { ime, prezime, email, lozinka, spol, uloga, adresa, oib, telefon, sveuciliste_id } = req.body;

  // Validacija unosa
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Provjeri postoji li korisnik s istim emailom
    const userExists = await Korisnici.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Korisnik s ovim emailom već postoji.' });
    }

    // Provjeri postoji li učilište s danim ID-om
    if (sveuciliste_id) {
      const sveucilisteExists = await Ucilista.findById(sveuciliste_id);
      if (!sveucilisteExists) {
        return res.status(400).json({ message: 'Učilište s ovim ID-om ne postoji.' });
      }
    }

    // Hashiranje lozinke
    const hashedPassword = await bcrypt.hash(lozinka, 10);

    // Kreiraj novog korisnika
    const korisnik = await Korisnici.create({
      ime,
      prezime,
      email,
      lozinka: hashedPassword,
      spol,
      uloga,
      adresa,
      oib,
      telefon,
      sveuciliste_id,
    });

    res.status(201).json({
      message: 'Korisnik uspješno registriran.',
      korisnik: {
        id: korisnik._id,
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        email: korisnik.email,
        uloga: korisnik.uloga,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Prijava korisnika
const loginUser = async (req, res) => {
  const { email, lozinka } = req.body;

  // Validacija unosa
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Provjeri postoji li korisnik
    const korisnik = await Korisnici.findOne({ email });
    if (!korisnik) {
      return res.status(400).json({ message: 'Neispravni email ili lozinka.' });
    }

    // Provjeri lozinku
    const isMatch = await bcrypt.compare(lozinka, korisnik.lozinka);
    if (!isMatch) {
      return res.status(400).json({ message: 'Neispravni email ili lozinka.' });
    }

    // Generiraj JWT token
    const token = jwt.sign({ id: korisnik._id, uloga: korisnik.uloga }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      token,
      korisnik: {
        id: korisnik._id,
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        email: korisnik.email,
        uloga: korisnik.uloga,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Odjava korisnika
const logoutUser = (req, res) => {
  res.status(200).json({ message: 'Korisnik je uspješno odjavljen.' });
};

module.exports = { registerUser, loginUser, logoutUser };
