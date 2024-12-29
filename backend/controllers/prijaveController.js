const Prijave = require('../models/Prijave');
const { validationResult } = require('express-validator');

// Kreiranje prijave
const createPrijava = async (req, res) => {
  // Validacija unosa
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { natjecaj_id } = req.body;

  try {
    const prijava = await Prijave.create({
      korisnik_id: req.korisnik._id, // ID prijavljenog korisnika
      natjecaj_id
    });
    res.status(201).json(prijava);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dohvat svih prijava
const getAllPrijave = async (req, res) => {
  try {
    const prijave = await Prijave.find().populate('korisnik_id natjecaj_id');
    res.status(200).json(prijave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dohvat prijave po ID-u
const getPrijavaById = async (req, res) => {
  try {
    const prijava = await Prijave.findById(req.params.id).populate('korisnik_id natjecaj_id');
    if (!prijava) {
      return res.status(404).json({ message: 'Prijava nije pronađena.' });
    }
    res.status(200).json(prijava);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ažuriranje statusa prijave
const updatePrijavaStatus = async (req, res) => {
  // Validacija unosa
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { status_prijave } = req.body;

  try {
    const prijava = await Prijave.findByIdAndUpdate(
      req.params.id,
      { status_prijave },
      { new: true }
    );
    if (!prijava) {
      return res.status(404).json({ message: 'Prijava nije pronađena.' });
    }
    res.status(200).json(prijava);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPrijava, getAllPrijave, getPrijavaById, updatePrijavaStatus };
