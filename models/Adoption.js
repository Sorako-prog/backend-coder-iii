const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Adoption', adoptionSchema);
