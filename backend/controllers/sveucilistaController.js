const Sveucilista = require('../models/Sveucilista');

// Kreiraj sveučilište
const createSveuciliste = async (req, res) => {
  try {
    const { naziv, adresa, telefon, email } = req.body;

    // Provjeri postoji li sveučilište s istim emailom
    const existingSveuciliste = await Sveucilista.findOne({ email });
    if (existingSveuciliste) {
      return res.status(400).json({ message: 'Sveucisliste s ovim emailom već postoji.' });
    }

    const sveuciliste = await Sveucilista.create({ naziv, adresa, telefon, email });
    res.status(201).json(sveuciliste);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dohvati sva sveučilišta
const getAllSveucilista = async (req, res) => {
  try {
    const sveucilista = await Sveucilista.find();
    res.status(200).json(sveucilista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dohvati sveučilište po ID-u
const getSveucilisteById = async (req, res) => {
  try {
    const sveuciliste = await Sveucilista.findById(req.params.id);
    if (!sveuciliste) {
      return res.status(404).json({ message: 'Sveuciliste nije pronađeno.' });
    }
    res.status(200).json(sveuciliste);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ažuriraj sveučilište
const updateSveuciliste = async (req, res) => {
  try {
    const { naziv, adresa, telefon, email } = req.body;

    const updatedSveuciliste = await Sveucilista.findByIdAndUpdate(
      req.params.id,
      { naziv, adresa, telefon, email },
      { new: true } // Vrati ažurirani dokument
    );

    if (!updatedSveuciliste) {
      return res.status(404).json({ message: 'Sveuciliste nije pronađeno.' });
    }

    res.status(200).json(updatedSveuciliste);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obriši sveuciliste
const deleteSveuciliste = async (req, res) => {
  try {
    const deletedSveuciliste = await Sveucilista.findByIdAndDelete(req.params.id);
    if (!deletedSveuciliste) {
      return res.status(404).json({ message: 'Sveučilište nije pronađeno.' });
    }

    res.status(200).json({ message: 'Sveučilište je uspješno obrisano.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSveuciliste,
  getAllSveucilista,
  getSveucilisteById,
  updateSveuciliste,
  deleteSveuciliste,
};
