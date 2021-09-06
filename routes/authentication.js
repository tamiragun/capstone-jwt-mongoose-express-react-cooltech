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
    res.status(403).send({ err: "Incorrect password" });
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
  //const auth = require("../middleware/authenticationMiddleware");
  // if (!req.headers["authorization"]) {
  //   console.log("Authorization denied - no token");
  //   res.status(401).send({
  //     err: "Authorization denied - no token",
  //     msg: "You are not logged in. Try again.",
  //   });
  // }
  // const headers = req.headers["authorization"];
  // const token = headers.split(" ")[1];
  try {
    // const decoded = jwt.verify(token, "jwt-secret");
    console.log(
      "Successfully returned role: ",
      req.role,
      " and affiliations: ",
      req.affiliation
    );
    res.send({ affiliation: req.affiliation, role: req.role });
  } catch (err) {
    console.log("CATCH ERROR: ", err);
    res.status(401).send({ err: "Could not retrieve affiliation" });
  }
});

module.exports = router;
