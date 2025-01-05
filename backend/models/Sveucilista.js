const mongoose = require('mongoose');

const sveucilisteSchema = mongoose.Schema(
  {
    naziv: { type: String, required: true }, 
    adresa: { type: String, required: true }, 
    kontakt_telefon: { type: String }, 
    email: { type: String, required: true, unique: true }, 
    //adresa: { type: String, required: true }
  },
  { timestamps: true } 
);

module.exports = mongoose.model('Sveucilista', sveucilisteSchema);
