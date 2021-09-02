const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/Users.controller");

// Endpoint to get all the users:

router.get("/", /*ADD AUTH MIDLEWARE, */ userControllers.listAllUsers);

module.exports = router;
