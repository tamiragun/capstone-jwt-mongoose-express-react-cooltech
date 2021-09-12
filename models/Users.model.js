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
  // Affiliation is an array of objects, each of whch have two keys: org_unit
  // and division.
  affiliation: {
    type: Array,
    required: true,
    default: [],
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
