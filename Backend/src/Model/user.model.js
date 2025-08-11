const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }, // 👈 this must be "email"
  password: { type: String, required: true },
  fullname: { type: String, required: true },
   bio: { type: String, default: '' }
});

module.exports = mongoose.model('User', UserSchema);