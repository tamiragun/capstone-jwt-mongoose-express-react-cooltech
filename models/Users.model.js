// Model for a 'user' document, with data types, default values, and required
// fields specified.

const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  OU: {
    type: Array,
    required: true,
  },
  division: {
    type: Array,
    required: true,
  },
  role: {
    type: String,
    required: false,
    default: "normal",
  },
  created: {
    type: Date,
    required: false,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
