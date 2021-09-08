// All the CRUD operations associated with the User model

let User = require("../models/Users.model");

// Create and save a new user:

exports.addUser = async function (req, res, next) {
  // Use the request body info to create a new document
  let userSchema = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    affiliation: req.body.affiliation,
  });

  // Try adding the document to the collection
  try {
    await userSchema.save(function (error, user) {
      if (error) {
        console.log(
          "Users.controller.adduser: Error creating the user:",
          error
        );
        res.status(500).send({
          error: error,
          message: "We couldn't registering you.",
        });
      } else {
        console.log(
          "Users.controller.adduser: Successfully added user: ",
          user.name
        );
        req.user = user;
        next();
      }
    });
  } catch (error) {
    console.log("Users.controller.adduser: Catch error:", error);
  }
};

// Display all users:

exports.listAllUsers = async function (req, res) {
  try {
    User.find()
      // Sort by created date
      .sort("-created")
      .exec(function (error, users) {
        if (error) {
          console.log(
            "Users.controller.listAllusers: Error listing all users: ",
            error
          );
          res.status(500).send({
            error: error,
            message: "We couldn't retrieve the users to display for you.",
          });
        } else {
          console.log(
            "Users.controller.listAllusers: Successfully displaying all users"
          );
          res.send(users);
        }
      });
  } catch (error) {
    console.log("Users.controller.listAllusers: Catch error: ", error);
  }
};

// Find a single user:

exports.findUser = async function (req, res, next) {
  let filter = {};
  if (req.body.email) {
    filter = { email: req.body.email };
  } else if (req.body._id) {
    filter = { _id: req.body._id };
  }

  try {
    User.findOne(filter).exec(function (error, user) {
      if (user === null) {
        console.log("Users.controller.findUser: User not found");
        res.status(500).send({
          error: "Users.controller.findUser: Custom error",
          message: "We couldn't find this user in our database.",
        });
      } else if (error) {
        console.log("Users.controller.findUser: Error finding user: ", error);
        res.status(500).send({
          error: error,
          message: "We couldn't find this user in our database.",
        });
      } else {
        req.user = user;
        console.log(
          "Users.controller.findUser: Successfully found user: ",
          user.name
        );
        next();
      }
    });
  } catch (error) {
    console.log("Users.controller.findUser: Catch error:", error);
  }
};

// Assign a role or division or OU to a user:

exports.assignUser = async function (req, res) {
  const requestedfields = req.body;
  let fieldsToUpdate = {};

  for (const key in requestedfields) {
    const element = requestedfields[key];
    if (key === "affiliation") {
      const affiliationMatch = req.user.affiliation.filter(
        (unit) => JSON.stringify(unit) === JSON.stringify(element)
      );
      if (affiliationMatch.length > 0) {
        res.status(405);
        console.log(
          "Users.controller.assignUser: User already associated with this org unit and division"
        );
        return res.send({
          error: "Users.controller.assignUser: custom error",
          message:
            "The user is already associated with this organisational unit and division.",
        });
      } else {
        req.user.affiliation.push(element);
        fieldsToUpdate.affiliation = req.user.affiliation;
      }
    } else if (key === "role") {
      if (req.user.role === element) {
        res.status(405);
        console.log(
          "Users.controller.assignUser: User already associated with this role"
        );
        return res.send({
          error: "Users.controller.assignUser: custom error",
          message: "The user is already associated with this role.",
        });
      } else {
        fieldsToUpdate.role = element;
      }
    }
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    console.log("Users.controller.assignUser: There are no fields to update");
    res.status(405).send({
      error: "Users.controller.assignUser: custom errore",
      message:
        "There were no fields to update. Please indicate what to assign.",
    });
  } else {
    try {
      User.findOneAndUpdate(
        { _id: requestedfields._id },
        fieldsToUpdate,
        { new: true },
        function (error, user) {
          if (error) {
            console.log(
              "Users.controller.assignUser: Something went wrong when updating the user: ",
              error
            );
            res.status(405).send({
              error: error,
              message: "We couldn't update this user.",
            });
          }
          console.log(
            "Users.controller.assignUser: Updated user successfully: ",
            user.name
          );
          res.send({
            message: "We updated the user successfully.",
          });
        }
      );
    } catch (error) {
      console.log("Users.controller.assignUser: Catch error: ", error);
    }
  }
};

// Unassign a division or OU to a user:

exports.unAssignUser = async function (req, res) {
  const requestedfields = req.body;
  let fieldsToUpdate = {};
  for (const key in requestedfields) {
    const element = requestedfields[key];
    if (key === "affiliation") {
      const newOrgUnits = req.user.affiliation.filter(
        (unit) => JSON.stringify(unit) !== JSON.stringify(element)
      );
      if (req.user.affiliation.length !== newOrgUnits.length) {
        fieldsToUpdate.affiliation = newOrgUnits;
      } else {
        console.log(
          "Users.controller.unAssignUser: User is not associated with this organisational unit and division."
        );
        res.status(404);
        return res.send({
          error: "Users.controller.unAssignUser: custom error",
          message:
            "The user is not associated with this organisational unit and division.",
        });
      }
    }
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    console.log("Users.controller.unAssignUser: There is nothing to unassign");
    res.status(405).send({
      error: "Users.controller.unAssignUser: custom error",
      message:
        "There were no fields to update. Please indicate what to unassign.",
    });
  }

  try {
    User.findOneAndUpdate(
      { _id: requestedfields._id },
      fieldsToUpdate,
      { new: true },
      function (error, user) {
        if (error) {
          console.log(
            "Users.controller.unAssignUser: Something went wrong when updating the user: ",
            error
          );
          res.status(504).send({
            error: error,
            message: "We couldn't update this user.",
          });
        }
        console.log(
          "Users.controller.unAssignUser: Updated user successfully: ",
          user.name
        );
        res.send({
          message: "We updated the user successfully.",
        });
      }
    );
  } catch (error) {
    console.log("Users.controller.unAssignUser: Catch error: ", error);
  }
};
