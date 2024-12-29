const mongoose = require('mongoose');

const natjecajSchema = mongoose.Schema({
  naziv: { type: String, required: true },
  opis: { type: String, required: true },
  vrsta_natjecaja: { type: String, required: true },
  datum_objave: { type: Date, default: Date.now },
  rok_prijave: { type: Date, required: true },
  tvrtka_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tvrtke' },
  sveuciliste_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sveucilista' },
  status_natjecaja: { type: String, enum: ['otvoren', 'zatvoren'], default: 'otvoren' } 
}, { timestamps: true });

natjecajSchema.pre('findOneAndDelete', async function (next) {
    const natjecajId = this.getQuery()._id;
    await mongoose.model('Prijave').deleteMany({ natjecaj_id: natjecajId });
    next();
  });  

module.exports = mongoose.model('Natjecaji', natjecajSchema);
