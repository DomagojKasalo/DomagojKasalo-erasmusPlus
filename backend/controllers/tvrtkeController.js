const Tvrtke = require('../models/Tvrtke');

// Kreiraj tvrtku
const createTvrtka = async (req, res) => {
  try {
    const { naziv, adresa, kontakt_telefon, email } = req.body;

    // Provjeri postoji li tvrtka s istim emailom
    const existingTvrtka = await Tvrtke.findOne({ email });
    if (existingTvrtka) {
      return res.status(400).json({ message: 'Tvrtka s ovim emailom već postoji.' });
    }

    const tvrtka = await Tvrtke.create({ naziv, adresa, kontakt_telefon, email });
    res.status(201).json(tvrtka);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dohvati sve tvrtke
const getAllTvrtke = async (req, res) => {
  try {
    const tvrtke = await Tvrtke.find();
    res.status(200).json(tvrtke);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dohvati tvrtku po ID-u
const getTvrtkaById = async (req, res) => {
  try {
    const tvrtka = await Tvrtke.findById(req.params.id);
    if (!tvrtka) {
      return res.status(404).json({ message: 'Tvrtka nije pronađena.' });
    }
    res.status(200).json(tvrtka);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ažuriraj tvrtku
const updateTvrtka = async (req, res) => {
  try {
    const { naziv, adresa, telefon, email } = req.body;

    const updatedTvrtka = await Tvrtke.findByIdAndUpdate(
      req.params.id,
      { naziv, adresa, telefon, email },
      { new: true } // Vrati ažurirani dokument
    );

    if (!updatedTvrtka) {
      return res.status(404).json({ message: 'Tvrtka nije pronađena.' });
    }

    res.status(200).json(updatedTvrtka);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obriši tvrtku
const deleteTvrtka = async (req, res) => {
  try {
    const deletedTvrtka = await Tvrtke.findByIdAndDelete(req.params.id);
    if (!deletedTvrtka) {
      return res.status(404).json({ message: 'Tvrtka nije pronađena.' });
    }

    res.status(200).json({ message: 'Tvrtka je uspješno obrisana.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTvrtka,
  getAllTvrtke,
  getTvrtkaById,
  updateTvrtka,
  deleteTvrtka,
};
