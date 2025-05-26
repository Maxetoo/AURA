const mongoose = require("mongoose");

const TherapistSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: { 
    type: String, 
    unique: true 
  },
  password: String,
  licenseNumber: String,
  specialties: {
    type: String,
    
  }, 
  bio: {
    type: String,
    required: false
  },
  availability: [
    { day: String, slots: [String] }
], 
});

module.exports = mongoose.model("Therapist", TherapistSchema);
