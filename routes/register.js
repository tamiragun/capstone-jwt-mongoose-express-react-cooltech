const express = require("express");
const jwt = require("jsonwebtoken");
const userControllers = require("../controllers/Users.controller");

const router = express.Router();

router.post("/", userControllers.addUser, (req, res) => {
  // TODO ADD VALIDATION IF EMAIL ALREADY EXISTS OR IF NOT ALL FIELDS ARE ENTERED
  const user = req.user;
  payload = {
    name: user.name,
    OU: user.OU,
    division: user.division,
    role: user.role,
  };

  const token = jwt.sign(JSON.stringify(payload), "jwt-secret", {
    algorithm: "HS256",
  });
  res.send({ token: token, message: "Registered successfully" });
});

module.exports = router;
