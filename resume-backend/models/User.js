const mongoose = require('mongoose');
//const server = require('./server');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Made optional for Google Auth
  googleId: { type: String, unique: true, sparse: true }, // Add googleId
  profileImageUrl: { type: String, default: null },
},
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);

