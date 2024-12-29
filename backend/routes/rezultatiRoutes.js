const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { check } = require('express-validator');
const {
  createRezultat,
  getAllRezultati
} = require('../controllers/rezultatiController');

// Kreiranje rezultata (samo admin)
router.post(
  '/',
  protect,
  restrictTo('admin'),
  [
    check('id_prijave').notEmpty().withMessage('ID prijave je obavezan.'),
    check('bodovi')
      .isNumeric()
      .withMessage('Bodovi moraju biti brojčana vrijednost.')
      .isInt({ min: 0, max: 100 })
      .withMessage('Bodovi moraju biti u rasponu od 0 do 100.')
  ],
  createRezultat
);

// Dohvat svih rezultata (admin i nastavnik)
router.get('/', protect, restrictTo('admin', 'nastavnik'), getAllRezultati);

module.exports = router;
