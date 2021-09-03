const express = require("express");
const jwt = require("jsonwebtoken");
const userControllers = require("../controllers/Users.controller");

const router = express.Router();

// Endpoint for users to login

router.post("/login", userControllers.findUser, (req, res) => {
  const password = req.body.password;
  const user = req.user;

  if (user === null) {
    res.status(500).send({ message: "User not found" });
  }
  if (password === user.password) {
    payload = {
      name: user.name,
      OU: user.OU,
      division: user.division,
      role: user.role,
    };

    const token = jwt.sign(JSON.stringify(payload), "jwt-secret", {
      algorithm: "HS256",
    });
    res.send({ token: token, message: "Logged in successfully" });
  } else {
    res.status(403).send({ err: "Incorrect password" });
  }
});

// Endpoint for users to register

router.post("/register", userControllers.addUser, (req, res) => {
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
