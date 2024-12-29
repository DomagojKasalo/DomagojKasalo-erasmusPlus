const mongoose = require('mongoose');

const rezultatiSchema = mongoose.Schema(
  {
    id_prijave: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Prijave', 
      required: true 
    }, // Veza na prijavu
    bodovi: { 
      type: Number, 
      required: true, 
      min: 0, 
      max: 100 
    }, // Broj bodova
    datum: { 
      type: Date, 
      default: Date.now 
    } // Datum dodjele rezultata
  },
  { timestamps: true } 
);

module.exports = mongoose.model('Rezultati', rezultatiSchema);
