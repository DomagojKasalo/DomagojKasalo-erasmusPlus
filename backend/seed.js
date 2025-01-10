const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Sveucilista = require('./models/Sveucilista');
const Korisnici = require('./models/Korisnici');
const Natjecaji = require('./models/Natjecaji');
const Prijave = require('./models/Prijave');
const Rezultati = require('./models/Rezultati');
const Tvrtke = require('./models/Tvrtke');
const bcrypt = require('bcryptjs');

dotenv.config();
const connectDB = require('./config/db');
connectDB();

const seedSveucilista = [
  { naziv: 'Sveučilište u Zagrebu', adresa: 'Trg Republike 14, Zagreb', telefon: '01 1234 5678', email: 'info@unizg.hr' },
  { naziv: 'Sveučilište u Splitu', adresa: 'Ulica Domovinskog rata 15, Split', telefon: '021 345 6789', email: 'info@unist.hr' },
];

const seedTvrtke = [
  { naziv: 'Tvrtka A', adresa: 'Ulica A 1', telefon: '091 111 1111', email: 'kontakt@tvrtkaa.com' },
  { naziv: 'Tvrtka B', adresa: 'Ulica B 2', telefon: '092 222 2222', email: 'kontakt@tvrtkab.com' },
];

const seedKorisnici = async (sveucilista) => [
  {
    ime: 'Ana',
    prezime: 'Marić',
    email: 'ana.maric@example.com',
    lozinka: await bcrypt.hash('password123', 10),
    spol: 'Ž',
    uloga: 'student',
    adresa: 'Ulica Hrvatske mladeži 3',
    telefon: '098 765 4321',
    sveuciliste_id: sveucilista[0]._id,
  },
  {
    ime: 'Maja',
    prezime: 'Majić',
    email: 'maja.majic@example.com',
    lozinka: await bcrypt.hash('password123', 10),
    spol: 'Ž',
    uloga: 'student',
    adresa: 'Ulica Domovinskog rata 3',
    telefon: '099 134 4789',
    sveuciliste_id: sveucilista[0]._id,
  },
  {
    ime: 'Ivan',
    prezime: 'Horvat',
    email: 'ivan.horvat@example.com',
    lozinka: await bcrypt.hash('password123', 10),
    spol: 'M',
    uloga: 'nastavnik',
    adresa: 'Put Zrinskih Frankopana 5',
    telefon: '091 234 5678',
    sveuciliste_id: sveucilista[1]._id,
  },
  {
    ime: 'Admin',
    prezime: 'Adminić',
    email: 'admin@example.com',
    lozinka: await bcrypt.hash('adminpass', 10),
    spol: 'M',
    uloga: 'admin',
    adresa: 'Admin Street 1',
    telefon: '099 999 9999',
  },
];

const seedNatjecaji = async (sveucilista, tvrtke) => [
  {
    naziv: 'Erasmus+ natječaj',
    opis: 'Natječaj za mobilnost studenata.',
    vrsta_natjecaja: 'mobilnost',
    rok_prijave: new Date('2025-01-9'),
    sveuciliste_id: sveucilista[0]._id,
    tvrtka_id: tvrtke[0]._id,
  },
  {
    naziv: 'Natječaj za stipendije',
    opis: 'Stipendije za izvrsne studente.',
    vrsta_natjecaja: 'stipendije',
    rok_prijave: new Date('2025-04-01'),
    sveuciliste_id: sveucilista[1]._id,
    tvrtka_id: tvrtke[1]._id,
  },
];

const seedPrijave = async (natjecaji, korisnici) => [
  {
    korisnik_id: korisnici[0]._id,
    natjecaj_id: natjecaji[0]._id,
    status_prijave: 'na čekanju',
  },
];

const seedRezultati = async (prijave) => [
  {
    id_prijave: prijave[0]._id,
    bodovi: 85,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();
    console.log('Baza podataka obrisana.');

    const sveucilista = await Sveucilista.insertMany(seedSveucilista);
    console.log('Sveučilišta dodana.');

    const tvrtke = await Tvrtke.insertMany(seedTvrtke);
    console.log('Tvrtke dodane.');

    const korisnici = await Korisnici.insertMany(await seedKorisnici(sveucilista));
    console.log('Korisnici dodani.');

    const natjecaji = await Natjecaji.insertMany(await seedNatjecaji(sveucilista, tvrtke));
    console.log('Natječaji dodani.');

    const prijave = await Prijave.insertMany(await seedPrijave(natjecaji, korisnici));
    console.log('Prijave dodane.');

    const rezultati = await Rezultati.insertMany(await seedRezultati(prijave));
    console.log('Rezultati dodani.');

    console.log('Baza podataka uspješno napunjena!');
    process.exit();
  } catch (error) {
    console.error('Greška prilikom punjenja baze:', error);
    process.exit(1);
  }
};

seedDatabase();