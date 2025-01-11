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
  { naziv: 'Sveučilište u Rijeci', adresa: 'Riječka ulica 10, Rijeka', telefon: '051 222 3333', email: 'info@uniri.hr' },
  { naziv: 'Sveučilište u Osijeku', adresa: 'Osječka cesta 20, Osijek', telefon: '031 444 5555', email: 'info@unios.hr' },
  { naziv: 'Sveučilište u Zadru', adresa: 'Zadarska ulica 25, Zadar', telefon: '023 555 6666', email: 'info@unz.hr' },
  { naziv: 'Sveučilište u Puli', adresa: 'Pulska ulica 5, Pula', telefon: '052 777 8888', email: 'info@unipu.hr' },
  { naziv: 'Sveučilište u Dubrovniku', adresa: 'Dubrovnik Stari grad 1, Dubrovnik', telefon: '020 888 9999', email: 'info@unidu.hr' },
  { naziv: 'Sveučilište Sjever', adresa: 'Sjeverni trg 1, Varaždin', telefon: '042 333 2222', email: 'info@unins.hr' },
  { naziv: 'Sveučilište u Slavonskom Brodu', adresa: 'Brodska ulica 30, Slavonski Brod', telefon: '035 123 4567', email: 'info@unisb.hr' },
  { naziv: 'Sveučilište u Vukovaru', adresa: 'Vukovarska ulica 50, Vukovar', telefon: '032 987 6543', email: 'info@univk.hr' },
];

const seedTvrtke = [
  { naziv: 'Tvrtka A', adresa: 'Ulica A 1', telefon: '091 111 1111', email: 'kontakt@tvrtkaa.com' },
  { naziv: 'Tvrtka B', adresa: 'Ulica B 2', telefon: '092 222 2222', email: 'kontakt@tvrtkab.com' },
  { naziv: 'Tvrtka C', adresa: 'Ulica C 3', telefon: '093 333 3333', email: 'kontakt@tvrtkac.com' },
  { naziv: 'Tvrtka D', adresa: 'Ulica D 4', telefon: '094 444 4444', email: 'kontakt@tvrtkad.com' },
  { naziv: 'Tvrtka E', adresa: 'Ulica E 5', telefon: '095 555 5555', email: 'kontakt@tvrtkae.com' },
  { naziv: 'Tvrtka F', adresa: 'Ulica F 6', telefon: '096 666 6666', email: 'kontakt@tvrtkaf.com' },
  { naziv: 'Tvrtka G', adresa: 'Ulica G 7', telefon: '097 777 7777', email: 'kontakt@tvrtkag.com' },
  { naziv: 'Tvrtka H', adresa: 'Ulica H 8', telefon: '098 888 8888', email: 'kontakt@tvrtkah.com' },
  { naziv: 'Tvrtka I', adresa: 'Ulica I 9', telefon: '099 999 9999', email: 'kontakt@tvrtkai.com' },
  { naziv: 'Tvrtka J', adresa: 'Ulica J 10', telefon: '097 101 1010', email: 'kontakt@tvrtkaj.com' },
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
  {
    ime: 'Petra',
    prezime: 'Novak',
    email: 'petra.novak@example.com',
    lozinka: await bcrypt.hash('password123', 10),
    spol: 'Ž',
    uloga: 'student',
    adresa: 'Ulica Stjepana Radića 7',
    telefon: '095 876 5432',
    sveuciliste_id: sveucilista[2]._id,
  },
  {
    ime: 'Karlo',
    prezime: 'Kovačić',
    email: 'karlo.kovacic@example.com',
    lozinka: await bcrypt.hash('password123', 10),
    spol: 'M',
    uloga: 'student',
    adresa: 'Trg Ante Starčevića 4',
    telefon: '097 543 2109',
    sveuciliste_id: sveucilista[3]._id,
  },
  {
    ime: 'Luka',
    prezime: 'Šimić',
    email: 'luka.simic@example.com',
    lozinka: await bcrypt.hash('password123', 10),
    spol: 'M',
    uloga: 'nastavnik',
    adresa: 'Nova ulica 12',
    telefon: '098 234 5671',
    sveuciliste_id: sveucilista[4]._id,
  },
  {
    ime: 'Ivana',
    prezime: 'Babić',
    email: 'ivana.babic@example.com',
    lozinka: await bcrypt.hash('password123', 10),
    spol: 'Ž',
    uloga: 'student',
    adresa: 'Zagrebačka ulica 9',
    telefon: '091 678 1234',
    sveuciliste_id: sveucilista[5]._id,
  },
  {
    ime: 'Marko',
    prezime: 'Perić',
    email: 'marko.peric@example.com',
    lozinka: await bcrypt.hash('password123', 10),
    spol: 'M',
    uloga: 'nastavnik',
    adresa: 'Osječka cesta 11',
    telefon: '093 456 7890',
    sveuciliste_id: sveucilista[6]._id,
  },
  {
    ime: 'Martina',
    prezime: 'Jurić',
    email: 'martina.juric@example.com',
    lozinka: await bcrypt.hash('password123', 10),
    spol: 'Ž',
    uloga: 'student',
    adresa: 'Vukovarska ulica 8',
    telefon: '092 345 6781',
    sveuciliste_id: sveucilista[7]._id,
  },
  {
    ime: 'Davor',
    prezime: 'Ilić',
    email: 'davor.ilic@example.com',
    lozinka: await bcrypt.hash('password123', 10),
    spol: 'M',
    uloga: 'student',
    adresa: 'Brodska ulica 15',
    telefon: '097 654 3210',
    sveuciliste_id: sveucilista[8]._id,
  }

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
  {
    naziv: 'Natječaj za stručno osposobljavanje',
    opis: 'Pružanje prakse studentima završnih godina.',
    vrsta_natjecaja: 'prakse',
    rok_prijave: new Date('2025-03-15'),
    sveuciliste_id: sveucilista[2]._id,
    tvrtka_id: tvrtke[2]._id,
  },
  {
    naziv: 'Natječaj za istraživačke projekte',
    opis: 'Prijava na istraživačke projekte u suradnji s industrijom.',
    vrsta_natjecaja: 'istraživanje',
    rok_prijave: new Date('2025-05-20'),
    sveuciliste_id: sveucilista[3]._id,
    tvrtka_id: tvrtke[3]._id,
  },
  {
    naziv: 'Natječaj za međunarodne projekte',
    opis: 'Suradnja s međunarodnim partnerima na inovativnim projektima.',
    vrsta_natjecaja: 'međunarodni projekti',
    rok_prijave: new Date('2025-06-30'),
    sveuciliste_id: sveucilista[4]._id,
    tvrtka_id: tvrtke[4]._id,
  },
  {
    naziv: 'Natječaj za volontiranje',
    opis: 'Prilika za studente da steknu volontersko iskustvo.',
    vrsta_natjecaja: 'volontiranje',
    rok_prijave: new Date('2025-07-15'),
    sveuciliste_id: sveucilista[5]._id,
    tvrtka_id: tvrtke[5]._id,
  },
  {
    naziv: 'Natječaj za startup projekte',
    opis: 'Financiranje inovativnih studentskih startup ideja.',
    vrsta_natjecaja: 'startup',
    rok_prijave: new Date('2025-09-10'),
    sveuciliste_id: sveucilista[6]._id,
    tvrtka_id: tvrtke[6]._id,
  },
  {
    naziv: 'Natječaj za kulturne projekte',
    opis: 'Potpora projektima koji promiču kulturu i umjetnost.',
    vrsta_natjecaja: 'kultura',
    rok_prijave: new Date('2025-10-05'),
    sveuciliste_id: sveucilista[7]._id,
    tvrtka_id: tvrtke[7]._id,
  },
  {
    naziv: 'Natječaj za tehnološke inovacije',
    opis: 'Razvoj novih tehnoloških rješenja u suradnji s tvrtkama.',
    vrsta_natjecaja: 'tehnologija',
    rok_prijave: new Date('2025-11-15'),
    sveuciliste_id: sveucilista[8]._id,
    tvrtka_id: tvrtke[8]._id,
  },
  {
    naziv: 'Natječaj za sportske aktivnosti',
    opis: 'Potpora sportskim inicijativama i natjecanjima.',
    vrsta_natjecaja: 'sport',
    rok_prijave: new Date('2025-12-01'),
    sveuciliste_id: sveucilista[9]._id,
    tvrtka_id: tvrtke[9]._id,
  },
];

const seedPrijave = async (natjecaji, korisnici) => [
  {
    korisnik_id: korisnici[0]._id,
    natjecaj_id: natjecaji[0]._id,
    status_prijave: 'na čekanju',
  },
  {
    korisnik_id: korisnici[1]._id,
    natjecaj_id: natjecaji[1]._id,
    status_prijave: 'odobreno',
  },
  {
    korisnik_id: korisnici[2]._id,
    natjecaj_id: natjecaji[2]._id,
    status_prijave: 'odbijeno',
  },
  {
    korisnik_id: korisnici[3]._id,
    natjecaj_id: natjecaji[3]._id,
    status_prijave: 'na čekanju',
  },
  {
    korisnik_id: korisnici[4]._id,
    natjecaj_id: natjecaji[4]._id,
    status_prijave: 'odobreno',
  },
  {
    korisnik_id: korisnici[5]._id,
    natjecaj_id: natjecaji[5]._id,
    status_prijave: 'odbijeno',
  },
  {
    korisnik_id: korisnici[6]._id,
    natjecaj_id: natjecaji[6]._id,
    status_prijave: 'na čekanju',
  },
  {
    korisnik_id: korisnici[7]._id,
    natjecaj_id: natjecaji[7]._id,
    status_prijave: 'odobreno',
  },
  {
    korisnik_id: korisnici[8]._id,
    natjecaj_id: natjecaji[8]._id,
    status_prijave: 'odbijeno',
  },
  {
    korisnik_id: korisnici[9]._id,
    natjecaj_id: natjecaji[9]._id,
    status_prijave: 'na čekanju',
  },
];


const seedRezultati = async (prijave) => [
  {
    id_prijave: prijave[0]._id,
    bodovi: 85,
  },
  {
    id_prijave: prijave[1]._id,
    bodovi: 90,
  },
  {
    id_prijave: prijave[2]._id,
    bodovi: 75,
  },
  {
    id_prijave: prijave[3]._id,
    bodovi: 88,
  },
  {
    id_prijave: prijave[4]._id,
    bodovi: 92,
  },
  {
    id_prijave: prijave[5]._id,
    bodovi: 68,
  },
  {
    id_prijave: prijave[6]._id,
    bodovi: 80,
  },
  {
    id_prijave: prijave[7]._id,
    bodovi: 95,
  },
  {
    id_prijave: prijave[8]._id,
    bodovi: 60,
  },
  {
    id_prijave: prijave[9]._id,
    bodovi: 78,
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