const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { check, body } = require('express-validator');
const {
  createPrijava,
  getAllPrijave,
  getPrijavaById,
  updatePrijavaStatus,
} = require('../controllers/prijaveController');
const Natjecaji = require('../models/Natjecaji');

// Kreiranje prijave (samo student i nastavnik )
router.post(
  '/',
  protect,
  restrictTo('student','nastavnik'),
  [
    check('natjecaj_id').notEmpty().withMessage('Natječaj ID je obavezan.'),
    body('natjecaj_id').custom(async (value) => {
      if (value) {
        const natjecaj = await Natjecaji.findById(value);
        if (!natjecaj) {
          throw new Error('Natječaj s danim ID-om ne postoji.');
        }
        if (natjecaj.status_natjecaja === 'zatvoren') {
          throw new Error('Natječaj je zatvoren i ne dopušta prijave.');
        }
      }
      return true;
    }),
  ],
  createPrijava
);

// Dohvat svih prijava (samo admin)
router.get('/', protect, restrictTo('admin'), getAllPrijave);

// Dohvat prijave po ID-u (dostupno svima s JWT-om)
router.get('/:id', protect, getPrijavaById);

// Ažuriranje statusa prijave (samo admin)
router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  [
    check('status_prijave')
      .isIn(['na čekanju', 'odobreno', 'odbijeno'])
      .withMessage('Status prijave mora biti: "na čekanju", "odobreno" ili "odbijeno".'),
    check('bodovi')
      .isNumeric()
      .withMessage('Bodovi moraju biti brojčana vrijednost.')
      .isInt({ min: 0, max: 100 })
      .withMessage('Bodovi moraju biti u rasponu od 0 do 100.')
  ],

  updatePrijavaStatus
);

module.exports = router;
