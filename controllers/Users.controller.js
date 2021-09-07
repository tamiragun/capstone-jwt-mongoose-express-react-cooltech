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
    // org_unit: req.body.org_unit,
    // division: req.body.division,
  });

  // Try adding the document to the collection
  try {
    await userSchema.save(function (err, user) {
      if (err) {
        console.log("Error creating the user");
        console.log(err);
        res
          .status(500)
          .send({ message: "Some error occurred while creating the user." });
      } else {
        console.log("Successfully added user: ", user.name);
        req.user = user;
        next();
      }
    });
  } catch (error) {
    console.log("CATCH ERROR:", error);
  }
};

// Display all users:

exports.listAllUsers = async function (req, res) {
  try {
    User.find()
      // Sort by created date
      .sort("-created")
      .exec(function (err, users) {
        if (err) {
          console.log("Error listing all users");
          console.log(err);
          res
            .status(500)
            .send({ message: "Some error occurred while retrieving users" });
        } else {
          console.log("Successfully displaying all users");
          res.send(users);
        }
      });
  } catch (error) {
    console.log("CATCH ERROR:", error);
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
    User.findOne(filter).exec(function (err, user) {
      if (err || user === null) {
        console.log("User not found");
        res.status(500).send({ message: "User not found" });
      } else {
        req.user = user;
        console.log("successfully found user: ", user.name);
        next();
      }
    });
  } catch (error) {
    console.log("CATCH ERROR 1:", error);
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
        console.log("User already associated with this org unit and division");
        return res.send({
          message: "User already associated with this org unit and division",
        });
      } else {
        req.user.affiliation.push(element);
        fieldsToUpdate.affiliation = req.user.affiliation;
      }
    } else if (key === "role") {
      if (req.user.role === element) {
        res.status(405);
        console.log("User already associated with this role");
        return res.send({
          message: "User already associated with this role",
        });
      } else {
        fieldsToUpdate.role = element;
      }
    }
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    console.log("There are no fields to update");
    res.status(405).send({
      message: "Please indicate what to assign",
    });
  } else {
    try {
      User.findOneAndUpdate(
        { _id: requestedfields._id },
        fieldsToUpdate,
        { new: true },
        function (err, user) {
          if (err) {
            console.log("Something went wrong when updating the user.");
          }
          console.log("Updated user successfully: ", user.name);
          res.send("Updated user successfully");
        }
      );
    } catch (error) {
      console.log("CATCH ERROR 2:", error);
    }
  }
};

// Unassign a division or OU to a user:

exports.unAssignUser = async function (req, res) {
  const requestedfields = req.body;
  let fieldsToUpdate = {};
  //console.log(requestedfields);
  for (const key in requestedfields) {
    const element = requestedfields[key];
    if (key === "affiliation") {
      const newOrgUnits = req.user.affiliation.filter(
        (unit) => JSON.stringify(unit) !== JSON.stringify(element)
      );
      if (req.user.affiliation.length !== newOrgUnits.length) {
        fieldsToUpdate.affiliation = newOrgUnits;
        console.log(newOrgUnits);
      } else {
        console.log("User is not associated with this organisational unit");
        res.status(404);
        return res.send({
          message: "User is not associated with this organisational unit",
        });
      }
    }
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    console.log("There is nothing to unassign");
    res.status(405).send({
      message: "Please indicate what to unassign",
    });
  }

  try {
    User.findOneAndUpdate(
      { _id: requestedfields._id },
      fieldsToUpdate,
      { new: true },
      function (err, user) {
        if (err) {
          console.log("Something went wrong when updating the user.");
        }
        console.log("Updated user successfully: ", user.name);
        res.send("Updated user successfully");
      }
    );
  } catch (error) {
    console.log("CATCH ERROR 3:", error);
  }
};
