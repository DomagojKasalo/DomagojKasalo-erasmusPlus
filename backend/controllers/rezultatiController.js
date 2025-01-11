const Rezultati = require('../models/Rezultati');
const { validationResult } = require('express-validator');

// Kreiranje rezultata
const createRezultat = async (req, res) => {
  // Validacija unosa
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id_prijave, bodovi } = req.body;

  try {
    const rezultat = await Rezultati.create({ id_prijave, bodovi });
    res.status(201).json(rezultat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dohvat svih rezultata
const getAllRezultati = async (req, res) => {
  //console.log("evo ga")
  try {
    const rezultati = await Rezultati.find().populate('id_prijave');
    console.log(rezultati)
    res.status(200).json(rezultati);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createRezultat, getAllRezultati };
