// All the CRUD operations associated with the User model

let User = require("../models/Users.model");

// Middleware to create and save a new user. Requires body params of
// name, email, password, and affiliation (i.e. and object with a "org_unit"
// and "division key".). If successfull, it adds the user to the request object
// and passes on to the next middleware. This is because the next middleware
// needs the user info in order to generate a token with a payload that draws from
// the user info.

exports.addUser = async function (req, res, next) {
  // Use the request body params to create a new document
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
        // In the case of any errors, send the client an object with the "error"
        // key set and a message for the user.
        console.log(
          "Users.controller.adduser: Error creating the user:",
          error
        );
        res.status(500).send({
          error: error,
          message: "We couldn't register you.",
        });
      } else {
        console.log(
          "Users.controller.adduser: Successfully added user: ",
          user.name
        );

        // If successful, add the user object to the request object and pass on
        req.user = user;
        next();
      }
    });
  } catch (error) {
    console.log("Users.controller.adduser: Catch error:", error);
  }
};

// Method to display all users. If successfull, it sends the list of users to
// the client.
exports.listAllUsers = async function (req, res) {
  try {
    User.find()
      // Sort by created date
      .sort("-created")
      .exec(function (error, users) {
        // In the case of any errors, send the client an object with the "error"
        // key set and a message for the user.
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

          // If successful, send the list of users to the client
          res.send(users);
        }
      });
  } catch (error) {
    console.log("Users.controller.listAllusers: Catch error: ", error);
  }
};

// Middleware to find a single user. Requires body params of user id or email.
// If the user is found, the user object is added to the request object and
// it passes on to the next function. It is set up as middleware because the next
// function will need to check against the keys of the user found in this search.
exports.findUser = async function (req, res, next) {
  // Set the filter as user id or email, depending on what was in the request body.
  let filter = {};
  if (req.body.email) {
    filter = { email: req.body.email };
  } else if (req.body._id) {
    filter = { _id: req.body._id };
  }

  // Seach the users collection with that filter applied.
  try {
    User.findOne(filter).exec(function (error, user) {
      // In the case of any errors, send the client an object with the "error"
      // key set and a message for the user.
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
        // If successful, dd the user object to the request object and move on.
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

// Method to assign a role or affiliation to a user. Requires body params of
// an object with the fields to update, and a "user" key on the request object.

exports.assignUser = async function (req, res) {
  // Get the object from the body params
  const requestedfields = req.body;
  let fieldsToUpdate = {};

  // Loop through the keys in the body params.
  for (const key in requestedfields) {
    const element = requestedfields[key];
    // If the key is "affiliation", then that is what needs to be updated.
    if (key === "affiliation") {
      // First check if that affiliation isn't already present in the user's list of
      // affiliations.
      const affiliationMatch = req.user.affiliation.filter(
        (unit) => JSON.stringify(unit) === JSON.stringify(element)
      );
      // If it is already present, send the client an object with the "error"
      // key set and a message for the user.
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
        // If it is not already in there, add it and update the object with the fields
        // to update.
      } else {
        req.user.affiliation.push(element);
        fieldsToUpdate.affiliation = req.user.affiliation;
      }

      // Repeat the same for "role": if role needs to be updated, check that the
      // user hasn't already been assigned that role. If not, add it to the object
      // with the fields to update.
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

  // Now that the object with the fields to update has been finalised by looping
  // through the body params, check that it indeed has one or more keys.
  if (Object.keys(fieldsToUpdate).length === 0) {
    console.log("Users.controller.assignUser: There are no fields to update");
    // If it is still empty, send back an error to the client.
    res.status(405).send({
      error: "Users.controller.assignUser: custom error",
      message:
        "There were no fields to update. Please indicate what to assign.",
    });
    // If not, perform the database action:
  } else {
    try {
      User.findOneAndUpdate(
        // Filter by the user id provided in the body params
        { _id: requestedfields._id },
        // Apply the object with fields to update here
        fieldsToUpdate,
        { new: true },
        function (error, user) {
          // In the case of any errors, send the client an object with the "error"
          // key set and a message for the user.
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
          // Upon success, send success message
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

// Method to assign an affiliation from a user. Requires body params of
// an object with the fields to update, and a "user" key on the request object.

exports.unAssignUser = async function (req, res) {
  // Get the object from the body params
  const requestedfields = req.body;
  let fieldsToUpdate = {};

  // Loop through the object
  for (const key in requestedfields) {
    const element = requestedfields[key];

    // To unassign an affiliation, first check if it is indeed one of the user's affiliations.
    if (key === "affiliation") {
      // Check by filtering the array of affiliations on the request body, looking for
      // a match between the affiliation object provided in the body params and those
      // already in the array.
      const newOrgUnits = req.user.affiliation.filter(
        (unit) => JSON.stringify(unit) === JSON.stringify(element)
      );
      // If no match was found, i.e. the new array is the same length as the
      // original array, update the "fields to update" object with this affiliation array.
      if (req.user.affiliation.length === newOrgUnits.length) {
        fieldsToUpdate.affiliation = newOrgUnits;
        // Otherwise, send an error to the client
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

  // Now that the object with the fields to update has been finalised by looping
  // through the body params, check that it indeed has one or more keys.
  if (Object.keys(fieldsToUpdate).length === 0) {
    // If it is still empty, send back an error to the client.
    console.log("Users.controller.unAssignUser: There is nothing to unassign");
    res.status(405).send({
      error: "Users.controller.unAssignUser: custom error",
      message:
        "There were no fields to update. Please indicate what to unassign.",
    });
  }
  // If not, perform the database action:
  try {
    User.findOneAndUpdate(
      // Filter by the user id provided in the body params
      { _id: requestedfields._id },
      // Apply the object with fields to update here
      fieldsToUpdate,
      { new: true },
      function (error, user) {
        // In the case of any errors, send the client an object with the "error"
        // key set and a message for the user.
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
        // Upon success, send success message
        res.send({
          message: "We updated the user successfully.",
        });
      }
    );
  } catch (error) {
    console.log("Users.controller.unAssignUser: Catch error: ", error);
  }
};
