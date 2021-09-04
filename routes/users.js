const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/Users.controller");
const auth = require("../middleware/authenticationMiddleware");

// Endpoint to get all the users:

router.post("/", auth.authenticateAdmin, userControllers.listAllUsers);

router.post(
  "/singleUser",
  auth.authenticateAdmin,
  userControllers.findUser,
  (req, res) => {
    res.send(req.user);
  }
);

router.post(
  "/assign",
  auth.authenticateAdmin,
  userControllers.findUser,
  userControllers.assignUser
);

router.post(
  "/unassign",
  auth.authenticateAdmin,
  userControllers.findUser,
  userControllers.unAssignUser
);

module.exports = router;
