const express = require("express");
const jwt = require("jsonwebtoken");
const userControllers = require("../controllers/Users.controller");
const auth = require("../middleware/authenticationMiddleware");

const router = express.Router();

// Endpoint for users to login

router.post("/login", userControllers.findUser, (req, res) => {
  const password = req.body.password;
  const user = req.user;

  if (password === user.password) {
    payload = {
      name: user.name,
      affiliation: user.affiliation,
      role: user.role,
    };

    const token = jwt.sign(JSON.stringify(payload), "jwt-secret", {
      algorithm: "HS256",
    });
    res.send({ token: token, message: "Logged in successfully" });
  } else {
    res.status(403).send({
      error: "Incorrect password",
      message: "You entered an incorrect password.",
    });
  }
});

// Endpoint for users to register

router.post("/register", userControllers.addUser, (req, res) => {
  // TODO ADD VALIDATION IF EMAIL ALREADY EXISTS OR IF NOT ALL FIELDS ARE ENTERED
  const user = req.user;
  payload = {
    name: user.name,
    affiliation: user.affiliation,
    role: user.role,
  };

  const token = jwt.sign(JSON.stringify(payload), "jwt-secret", {
    algorithm: "HS256",
  });
  res.send({ token: token, message: "Registered successfully" });
});

router.post("/home", auth.authenticateNormal, (req, res) => {
  try {
    console.log(
      "Successfully returned role: ",
      req.role,
      " and affiliations: ",
      req.affiliation
    );
    res.send({ affiliation: req.affiliation, role: req.role });
  } catch (error) {
    console.log("CATCH ERROR: ", error);
    res.status(401).send({
      error: "Could not retrieve affiliation",
      message:
        "We were unable to find the organisational unit and division for you.",
    });
  }
});

module.exports = router;
