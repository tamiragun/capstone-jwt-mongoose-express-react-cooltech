// Route with all the endpoints for authenticatin actions

const express = require("express");
const jwt = require("jsonwebtoken");
const userControllers = require("../controllers/Users.controller");
const auth = require("../middleware/authenticationMiddleware");

const router = express.Router();

// Endpoint for users to login. Access is for all roles. Requires
// body parameters for the email and password. If the user exists
// and the password matches, a token is generated and returned.
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

// Endpoint for users to login. Access is for all roles. Requires
// body parameters for the user info. If the user is generated successfully,
// a token is generated and returned.
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

// Endpoint to check which affiliations to display on the logged in
// user's homepage. Access is for all roles. Requires athentication
// header to be set. Returns the role and affiliation based on the token.
router.post("/home", auth.authenticateNormal, (req, res) => {
  // Used a try / catch block here because role and affiliation could be absent.
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
      error: error,
      message:
        "We were unable to find the organisational unit and division for you.",
    });
  }
});

// Export the router, will be imported in app.js with all the other routes.
module.exports = router;
