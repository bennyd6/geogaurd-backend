const mongoose = require('mongoose');

const citizenSchema = new mongoose.Schema({
  pincode: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
  }
});

const Citizen = mongoose.model('Citizen', citizenSchema);
module.exports = Citizen;
