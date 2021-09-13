// Route with all the endpoints for credentials database actions

const express = require("express");
const router = express.Router();
const credentialControllers = require("../controllers/Credentials.controller");
const auth = require("../middleware/authenticationMiddleware");

// Endpoint to display all users of a given affiliation.
// Access is for all roles, but the user must be a part of the affiliation
// that is being displayed. Requires authorisation header to be set,
// and body params with the affiliation to display.
// Returns an array of credentials.
router.post(
  "/",
  auth.authenticateNormal,
  auth.checkAffiliation,
  credentialControllers.listAllCredentials
);

// Endpoint to display a single credential, so that it can be edited.
// Access is for managers and admins only. Requires authorisation
// header to be set, and body params for the credential id.
// Returns the requested credential.
router.post(
  "/display",
  auth.authenticateManager,
  credentialControllers.findCredential
);

// Endpoint to update an existing credential. Access is for admins
// and managers only. Requires authorisation header to be set, and
// body params for the credential id, and for the fields to update.
// Returns a success message only.
router.post(
  "/update",
  auth.authenticateManager,
  credentialControllers.updateCredential
);

// Endpoint to create a new credential. Access is for all roles.
// Requires authorisation header to be set, and body params for
// the ields to populate the credential with.
// Returns a success message only.
router.post(
  "/create",
  auth.authenticateNormal,
  credentialControllers.addCredential
);

// Endpoint to check if the user has permission to edit credentials.
// Access is for admins and managers only. Requires authorisation
// header to be set.
// Returns an object with property "access" set to true.
router.post(
  "/updatePermission",
  auth.authenticateNormal,
  auth.checkEditPermission
);

// Export the router, will be imported in app.js with all the other routes.
module.exports = router;
