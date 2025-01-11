const jwt = require('jsonwebtoken');
const Korisnici = require('../models/Korisnici');

// Middleware za provjeru JWT tokena
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Ekstrakcija tokena
      token = req.headers.authorization.split(' ')[1];

      // Dekodiranje tokena
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Dohvaćanje korisnika bez lozinke
      req.korisnik = await Korisnici.findById(decoded.id).select('-lozinka');

      next();
    } catch (error) {
      res.status(401).json({ message: 'Neautoriziran pristup, token nije valjan.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Neautoriziran pristup, token nije prisutan.' });
  }
};

// Middleware za ograničavanje pristupa prema ulozi
const restrictTo = (...uloge) => {
  return (req, res, next) => {
    // console.log(req.korisnik.uloga)
    // console.log(uloge)
    if (!uloge.includes(req.korisnik.uloga)) {
      return res.status(403).json({ message: 'Nemate ovlasti za ovu akciju.' });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
