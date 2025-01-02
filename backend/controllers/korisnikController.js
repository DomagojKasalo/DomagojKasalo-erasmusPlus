const Korisnici = require('../models/Korisnici');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Registracija korisnika
const registerUser = async (req, res) => {
  const { ime, prezime, email, lozinka, spol, uloga, adresa, oib, telefon, sveuciliste_id } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userExists = await Korisnici.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Korisnik s ovim emailom već postoji.' });
    }

    const hashedPassword = await bcrypt.hash(lozinka, 10);

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
      korisnik: { id: korisnik._id, ime: korisnik.ime, prezime: korisnik.prezime, email: korisnik.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Prijava korisnika
const loginUser = async (req, res) => {
  const { email, lozinka } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const korisnik = await Korisnici.findOne({ email });
    if (!korisnik) {
      return res.status(400).json({ message: 'Neispravni email ili lozinka.' });
    }

    const isMatch = await bcrypt.compare(lozinka, korisnik.lozinka);
    if (!isMatch) {
      return res.status(400).json({ message: 'Neispravni email ili lozinka.' });
    }

    const token = jwt.sign({ id: korisnik._id, uloga: korisnik.uloga }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, korisnik: { id: korisnik._id, ime: korisnik.ime, prezime: korisnik.prezime, email: korisnik.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pregled vlastitog profila
const getMyProfile = async (req, res) => {
  try {
    const korisnik = await Korisnici.findById(req.korisnik._id).select('-lozinka');
    if (!korisnik) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }
    res.status(200).json(korisnik);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Uređivanje vlastitog profila
const updateMyProfile = async (req, res) => {
  try {
    const updates = req.body;
    const korisnik = await Korisnici.findByIdAndUpdate(req.korisnik._id, updates, { new: true }).select('-lozinka');
    if (!korisnik) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }
    res.status(200).json(korisnik);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Brisanje vlastitog profila
const deleteMyProfile = async (req, res) => {
  try {
    const korisnik = await Korisnici.findByIdAndDelete(req.korisnik._id);
    if (!korisnik) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }
    res.status(200).json({ message: 'Korisnički profil uspješno obrisan.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Administratorski pregled svih korisnika
const getAllUsers = async (req, res) => {
  try {
    const korisnici = await Korisnici.find().select('-lozinka');
    res.status(200).json(korisnici);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Administratorsko ažuriranje korisnika
const updateUser = async (req, res) => {
  try {
    const korisnik = await Korisnici.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-lozinka');
    if (!korisnik) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }
    res.status(200).json(korisnik);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Administratorsko brisanje korisnika
const deleteUser = async (req, res) => {
  try {
    const korisnik = await Korisnici.findByIdAndDelete(req.params.id);
    if (!korisnik) {
      return res.status(404).json({ message: 'Korisnik nije pronađen.' });
    }
    res.status(200).json({ message: 'Korisnik uspješno obrisan.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logoutUser = (req, res) => {
  res.status(200).json({ message: 'Korisnik je uspješno odjavljen.' });
};

module.exports = {
  registerUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
  getAllUsers,
  updateUser,
  deleteUser,
  logoutUser,
};
