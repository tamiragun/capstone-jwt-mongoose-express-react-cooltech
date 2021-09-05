const express = require("express");
const router = express.Router();
const credentialControllers = require("../controllers/Credentials.controller");
const auth = require("../middleware/authenticationMiddleware");

// Endpoint to get all the credentials for a given division:

router.post(
  "/",
  auth.authenticateNormal,
  (req, res, next) => {
    if (
      req.org_unit.includes(req.body.org_unit) &&
      req.division.includes(req.body.division)
    ) {
      console.log(
        "Successfully verified that user is in this org_unit and division"
      );
      next();
    } else {
      console.log("User does not belong to this org_unit or division");
      res.status(403).send({
        message: "You do not have permission to view these credentials",
      });
    }
  },
  credentialControllers.listAllCredentials
);

// Endpoint to get a single credential, so it can be displayed and edited:

router.post(
  "/display",
  auth.authenticateManager,
  credentialControllers.findCredential,
  (req, res) => {
    res.send(req.credential);
  }
);

// Endpoint to update an existing credential:

router.post(
  "/update",
  auth.authenticateManager,
  credentialControllers.updateCredential
);

// Endpoint to create a new credential:

router.post(
  "/create",
  auth.authenticateManager,
  credentialControllers.addCredential
);

// Endpoint to check if credentials may be edited:

router.post("/updatePermission", auth.authenticateManager, (req, res) => {
  if (req.role === "manager" || req.role === "admin")
    console.log("Successfully granted permission to edit credential");
  res.send({ access: true });
});

module.exports = router;
