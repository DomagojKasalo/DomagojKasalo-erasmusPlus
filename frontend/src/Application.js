const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Veza na model korisnika (student)
    required: true,
  },
  status: {
    type: String,
    enum: ['odobreno', 'odbijeno', 'na čekanju'],
    required: true,
  },
});

module.exports = mongoose.model('Application', applicationSchema);
