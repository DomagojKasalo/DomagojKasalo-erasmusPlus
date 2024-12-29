const mongoose = require('mongoose');

const korisnikSchema = mongoose.Schema({
  ime: { type: String, required: true },
  prezime: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  lozinka: { type: String, required: true },
  uloga: { type: String, enum: ['student', 'nastavnik', 'admin'], default: 'student' },
  spol: { type: String, enum: ['M', 'Ž'], required: true },
  adresa: { type: String },
  oib: { type: String },
  telefon: { type: String },
  sveuciliste_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sveucilista' } 
}, { timestamps: true });

module.exports = mongoose.model('Korisnici', korisnikSchema);
