const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/korisnikRoutes');
const prijaveRoutes = require('./routes/prijaveRoutes');
const rezultatiRoutes = require('./routes/rezultatiRoutes');
const natjecajiRoutes = require('./routes/natjecajiRoutes');
const sveucilistaRoutes = require('./routes/sveucilistaRoutes');
const tvrtkeRoutes = require('./routes/tvrtkeRoutes');

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/prijave', prijaveRoutes);
app.use('/api/rezultati', rezultatiRoutes);
app.use('/api/natjecaji', natjecajiRoutes);
app.use('/api/sveucilista', sveucilistaRoutes);
app.use('/api/tvrtke', tvrtkeRoutes);

app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Pokretanje servera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
