const mongoose = require('mongoose');

const tvrtkaSchema = mongoose.Schema(
  {
    naziv: { type: String, required: true }, 
    adresa: { type: String, required: true }, 
    telefon: { type: String }, 
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true } 
);

module.exports = mongoose.model('Tvrtke', tvrtkaSchema);
