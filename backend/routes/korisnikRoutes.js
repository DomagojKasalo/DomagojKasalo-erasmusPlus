const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/korisnikController');
const { check, body } = require('express-validator');
const Sveucilista = require('../models/Sveucilista');

// Ruta za registraciju korisnika
router.post(
  '/register',
  [
    check('ime').notEmpty().withMessage('Ime je obavezno.'),
    check('prezime').notEmpty().withMessage('Prezime je obavezno.'),
    check('email').isEmail().withMessage('Unesite ispravan email.'),
    check('lozinka')
      .isLength({ min: 6 })
      .withMessage('Lozinka mora imati najmanje 6 znakova.'),
    check('spol').isIn(['M', 'Ž']).withMessage('Spol mora biti "M" ili "Ž".'),
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
  registerUser
);

// Ruta za prijavu korisnika
router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Unesite ispravan email.'),
    check('lozinka').notEmpty().withMessage('Lozinka je obavezna.'),
  ],
  loginUser
);

// Ruta za odjavu korisnika
router.post('/logout', logoutUser);

module.exports = router;
