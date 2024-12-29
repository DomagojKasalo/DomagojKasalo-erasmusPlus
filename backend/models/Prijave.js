const mongoose = require('mongoose');

const prijavaSchema = mongoose.Schema({
  korisnik_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Korisnici', required: true },
  natjecaj_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Natjecaji', required: true },
  datum_prijave: { type: Date, default: Date.now },
  status_prijave: { type: String, enum: ['na čekanju', 'odobreno', 'odbijeno'], default: 'na čekanju' } 
}, { timestamps: true });

module.exports = mongoose.model('Prijave', prijavaSchema);
