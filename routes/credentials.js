const express = require("express");
const router = express.Router();
const credentialControllers = require("../controllers/Credentials.controller");
const auth = require("../middleware/authenticationMiddleware");

// Endpoint to get all the credentials for a given division:

router.post(
  "/",
  auth.authenticateNormal,
  auth.checkAffiliation,
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

router.post(
  "/updatePermission",
  auth.authenticateManager,
  auth.checkEditPermission
);

module.exports = router;
