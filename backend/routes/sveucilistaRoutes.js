const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  createSveuciliste,
  getAllSveucilista,
  getSveucilisteById,
  updateSveuciliste,
  deleteSveuciliste,
} = require('../controllers/sveucilistaController');
const { check } = require('express-validator');

// Ruta za kreiranje sveučilišta (samo admin)
router.post(
  '/',
  protect,
  restrictTo('admin'),
  [
    check('naziv').notEmpty().withMessage('Naziv je obavezan.'),
    check('adresa').notEmpty().withMessage('Adresa je obavezna.'),
    check('email').isEmail().withMessage('Email mora biti ispravan.'),
    check('kontakt_telefon').notEmpty().withMessage('Telefon je obavezan.') // Dodano novo polje
  ],
  createSveuciliste
);

// Ruta za dohvat svih sveučilišta (dostupno svima s JWT-om)
router.get('/', protect, getAllSveucilista);

// Ruta za dohvat sveučilišta po ID-u (dostupno svima s JWT-om)
router.get('/:id', protect, getSveucilisteById);

// Ruta za ažuriranje sveučilišta (samo admin)
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  [
    check('naziv').optional().notEmpty().withMessage('Naziv ne smije biti prazan.'),
    check('adresa').optional().notEmpty().withMessage('Adresa ne smije biti prazna.'),
    check('email').optional().isEmail().withMessage('Email mora biti ispravan.'),
  ],
  updateSveuciliste
);

// Ruta za brisanje sveučilišta (samo admin)
router.delete('/:id', protect, restrictTo('admin'), deleteSveuciliste);

module.exports = router;
