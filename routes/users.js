// Route with all the endpoints for user database actions

const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/Users.controller");
const auth = require("../middleware/authenticationMiddleware");

// Endpoint to display all users. Access is for admins only. Requires
// authorisation header to be set, and returns an array of users.
router.post("/", auth.authenticateAdmin, userControllers.listAllUsers);

// Endpoint to display a single user. Access is for admins only. Requires
// authorisation header to be set, and body params for the user id or email.
// Returns the requested user.
router.post(
  "/singleUser",
  auth.authenticateAdmin,
  userControllers.findUser,
  (req, res) => {
    res.send(req.user);
  }
);

// Endpoint to update a user with a new role or affiliation (i.e. org
// unit and division). Access is for admins only. Requires
// authorisation header to be set, and body params for the user id
// as well as fields to update. Returns a success message only.
router.post(
  "/assign",
  auth.authenticateAdmin,
  userControllers.findUser,
  userControllers.assignUser
);

// Endpoint to remove from an affiliation (i.e. org unit and division)
// from a user. Access is for admins only. Requires authorisation
// header to be set, and body params for the user id as well as fields to
// update. Returns a success message only.
router.post(
  "/unassign",
  auth.authenticateAdmin,
  userControllers.findUser,
  userControllers.unAssignUser
);

// Export the router, will be imported in app.js with all the other routes.
module.exports = router;
