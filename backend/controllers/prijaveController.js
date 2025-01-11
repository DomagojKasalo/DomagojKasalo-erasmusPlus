const Prijave = require('../models/Prijave');
const { validationResult } = require('express-validator');

// Kreiranje prijave
const createPrijava = async (req, res) => {
  // Validacija unosa
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { natjecaj_id,vrsta_natjecaja } = req.body;

  try {
    // Provjera da li već postoji prijava ovog korisnika za ovaj natječaj
    // const korisnikUloga = req.korisnik.uloga;
    // if(vrsta_natjecaja==='nastavnik' && korisnikUloga=='student'){
    //   return res.status(400).json({ message: 'Ne možete se prijaviti na natjecaj za nastavnika' });
    // }
    const existingPrijava = await Prijave.findOne({
      korisnik_id: req.korisnik._id, // ID prijavljenog korisnika
      natjecaj_id,
    });

    if (existingPrijava) {
      return res.status(400).json({ message: 'Već ste se prijavili na ovaj natječaj.' });
    }
    

    // Kreiranje nove prijave
    const prijava = await Prijave.create({
      korisnik_id: req.korisnik._id, // ID prijavljenog korisnika
      natjecaj_id,
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
    prijava.status_prijave = req.body.status_prijave;
    if (req.body.bodovi !== undefined) { 
      prijava.bodovi = req.body.bodovi; 
    }
    await prijava.save();
    res.status(200).json(prijava);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPrijava, getAllPrijave, getPrijavaById, updatePrijavaStatus };
