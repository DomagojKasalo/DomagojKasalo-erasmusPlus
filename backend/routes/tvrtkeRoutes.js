const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  createTvrtka,
  getAllTvrtke,
  getTvrtkaById,
  updateTvrtka,
  deleteTvrtka,
} = require('../controllers/tvrtkeController');
const { check } = require('express-validator');

// Kreiranje tvrtke (samo admin)
router.post(
  '/',
  protect,
  restrictTo('admin'),
  [
    check('naziv').notEmpty().withMessage('Naziv je obavezan.'),
    check('adresa').notEmpty().withMessage('Adresa je obavezna.'),
    check('email').isEmail().withMessage('Email mora biti ispravan.'),
    check('telefon').notEmpty().withMessage('Telefon je obavezan.') // Dodano novo polje
  ],
  createTvrtka
);

// Dohvat svih tvrtki (dostupno svima s JWT-om)
router.get('/', protect, getAllTvrtke);

// Dohvat tvrtke po ID-u (dostupno svima s JWT-om)
router.get('/:id', protect, getTvrtkaById);

// Ažuriranje tvrtke (samo admin)
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  [
    check('naziv').optional().notEmpty().withMessage('Naziv ne smije biti prazan.'),
    check('adresa').optional().notEmpty().withMessage('Adresa ne smije biti prazna.'),
    check('email').optional().isEmail().withMessage('Email mora biti ispravan.'),
  ],
  updateTvrtka
);

// Brisanje tvrtke (samo admin)
router.delete('/:id', protect, restrictTo('admin'), deleteTvrtka);

module.exports = router;
