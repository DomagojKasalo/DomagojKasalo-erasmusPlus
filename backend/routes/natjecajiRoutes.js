const express = require('express');
const router = express.Router();
const {
  getAllNatjecaji,
  getNatjecajById,
  createNatjecaj,
  updateNatjecaj,
  deleteNatjecaj,
} = require('../controllers/natjecajiController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { check, body } = require('express-validator');
const Sveucilista = require('../models/Sveucilista');
const Tvrtke = require('../models/Tvrtke');

// Dohvat svih natječaja (dostupno svima s JWT-om)
router.get('/', protect, getAllNatjecaji);

// Dohvat natječaja po ID-u (dostupno svima s JWT-om)
router.get('/:id', protect, getNatjecajById);

// Kreiranje natječaja (samo admin)
router.post(
  '/',
  protect,
  restrictTo('admin'),
  [
    check('naziv').notEmpty().withMessage('Naziv je obavezan.'),
    check('opis').notEmpty().withMessage('Opis je obavezan.'),
    check('vrsta_natjecaja').notEmpty().withMessage('Vrsta natječaja je obavezna.'),
    check('rok_prijave')
      .isISO8601()
      .withMessage('Rok prijave mora biti validan datum.'),
    body('tvrtka_id').custom(async (value) => {
      if (value) {
        const tvrtka = await Tvrtke.findById(value);
        if (!tvrtka) {
          throw new Error('Tvrtka s danim ID-om ne postoji.');
        }
      }
      return true;
    }),
    body('sveuciliste_id').custom(async (value) => {
      if (value) {
        const sveuciliste = await Sveucilista.findById(value);
        if (!sveuciliste) {
          throw new Error('Sveučilište s danim ID-om ne postoji.');
        }
      }
      return true;
    }),
  ],
  createNatjecaj
);

// Ažuriranje natječaja (samo admin)
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  [
    check('naziv').optional().notEmpty().withMessage('Naziv ne smije biti prazan.'),
    check('opis').optional().notEmpty().withMessage('Opis ne smije biti prazan.'),
    check('vrsta_natjecaja').optional().notEmpty().withMessage('Vrsta natječaja ne smije biti prazna.'),
    check('rok_prijave')
      .optional()
      .isISO8601()
      .withMessage('Rok prijave mora biti validan datum.'),
    body('tvrtka_id').optional().custom(async (value) => {
      if (value) {
        const tvrtka = await Tvrtke.findById(value);
        if (!tvrtka) {
          throw new Error('Tvrtka s danim ID-om ne postoji.');
        }
      }
      return true;
    }),
    body('sveuciliste_id').optional().custom(async (value) => {
      if (value) {
        const sveuciliste = await Sveucilista.findById(value);
        if (!sveuciliste) {
          throw new Error('Sveučilište s danim ID-om ne postoji.');
        }
      }
      return true;
    }),
  ],
  updateNatjecaj
);

// Brisanje natječaja (samo admin)
router.delete('/:id', protect, restrictTo('admin'), deleteNatjecaj);

module.exports = router;
