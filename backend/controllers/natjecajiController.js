const Natjecaji = require('../models/Natjecaji');
const Sveucilista = require('../models/Sveucilista');
const Tvrtke = require('../models/Tvrtke'); 
const { validationResult } = require('express-validator');

// Dohvati sve natječaje
const getAllNatjecaji = async (req, res) => {
  try {
    const natjecaji = await Natjecaji.find().populate('tvrtka_id sveuciliste_id');
    res.status(200).json(natjecaji);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dohvati natječaj po ID-u
const getNatjecajById = async (req, res) => {
  try {
    const natjecaj = await Natjecaji.findById(req.params.id).populate('tvrtka_id sveuciliste_id');
    if (!natjecaj) {
      return res.status(404).json({ message: 'Natječaj nije pronađen' });
    }
    res.status(200).json(natjecaj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Kreiraj novi natječaj
const createNatjecaj = async (req, res) => {
  // Validacija unosa
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { naziv, opis, vrsta_natjecaja, rok_prijave, tvrtka_id, sveuciliste_id } = req.body;

  try {
    // Provjeri postoji li tvrtka s danim ID-om
    if (tvrtka_id) {
      const tvrtkaExists = await Tvrtke.findById(tvrtka_id);
      if (!tvrtkaExists) {
        return res.status(400).json({ message: 'Tvrtka s ovim ID-om ne postoji.' });
      }
    }

    // Provjeri postoji li učilište s danim ID-om
    if (sveuciliste_id) {
      const sveucilisteExists = await Sveucilista.findById(sveuciliste_id);
      if (!sveucilisteExists) {
        return res.status(400).json({ message: 'Učilište s ovim ID-om ne postoji.' });
      }
    }

    // Kreiraj natječaj
    const newNatjecaj = await Natjecaji.create({
      naziv,
      opis,
      vrsta_natjecaja,
      datum_objave: Date.now(),
      rok_prijave,
      tvrtka_id,
      sveuciliste_id,
    });

    res.status(201).json(newNatjecaj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ažuriraj natječaj
const updateNatjecaj = async (req, res) => {
  // Validacija unosa
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { naziv, opis, vrsta_natjecaja, rok_prijave, tvrtka_id, sveuciliste_id } = req.body;

  try {
    // Provjeri postoji li tvrtka s danim ID-om
    if (tvrtka_id) {
      const tvrtkaExists = await Tvrtke.findById(tvrtka_id);
      if (!tvrtkaExists) {
        return res.status(400).json({ message: 'Tvrtka s ovim ID-om ne postoji.' });
      }
    }

    // Provjeri postoji li učilište s danim ID-om
    if (sveuciliste_id) {
      const sveucilisteExists = await Sveucilista.findById(sveuciliste_id);
      if (!sveucilisteExists) {
        return res.status(400).json({ message: 'Učilište s ovim ID-om ne postoji.' });
      }
    }

    // Ažuriraj natječaj
    const updatedNatjecaj = await Natjecaji.findByIdAndUpdate(
      req.params.id,
      { naziv, opis, vrsta_natjecaja, rok_prijave, tvrtka_id, sveuciliste_id },
      { new: true }
    );

    if (!updatedNatjecaj) {
      return res.status(404).json({ message: 'Natječaj nije pronađen' });
    }

    res.status(200).json(updatedNatjecaj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obriši natječaj
const deleteNatjecaj = async (req, res) => {
  try {
    const deletedNatjecaj = await Natjecaji.findByIdAndDelete(req.params.id);
    if (!deletedNatjecaj) {
      return res.status(404).json({ message: 'Natječaj nije pronađen' });
    }
    res.status(200).json({ message: 'Natječaj uspješno obrisan' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllNatjecaji, getNatjecajById, createNatjecaj, updateNatjecaj, deleteNatjecaj };
