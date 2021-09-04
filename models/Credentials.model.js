// Model for a 'credential' document, with data types, default values, and required
// fields specified.

const mongoose = require("mongoose");

let credentialSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  login: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  org_unit: {
    type: String,
    required: true,
  },
  division: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: false,
    default: Date.now,
  },
});

module.exports = mongoose.model("Credential", credentialSchema);
