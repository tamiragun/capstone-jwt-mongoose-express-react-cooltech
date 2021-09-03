// All the CRUD operations associated with the User model

let User = require("../models/Users.model");

// Create and save a new user:

exports.addUser = async function (req, res, next) {
  // Use the request body info to create a new document
  let userSchema = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    org_unit: req.body.org_unit,
    division: req.body.division,
  });

  // Try adding the document to the collection
  try {
    await userSchema.save(function (err, user) {
      if (err) {
        console.log(err);
        res
          .status(500)
          .send({ message: "Some error occurred while creating the user." });
      } else {
        console.log(user);
        req.user = user;
        next();
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// Display all users:

exports.listAllUsers = async function (req, res) {
  try {
    await User.find()
      // Sort by created date
      .sort("-created")
      .exec(function (err, users) {
        if (err) {
          console.log(err);
          res
            .status(500)
            .send({ message: "Some error occurred while retrieving users" });
        } else {
          res.send(users);
        }
      });
  } catch (error) {
    console.log(error);
  }
};

// Find a signle users:

exports.findUser = async function (req, res, next) {
  const filter = { email: req.body.email };
  try {
    await User.findOne(filter).exec(function (err, user) {
      if (err) {
        console.log(err);
        res.status(500).send({ message: "User not found" });
      } else {
        req.user = user;
        next();
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// Update a single user (role or division or OU):

exports.updateUser = async function (req, res) {
  const requestedfields = req.body;
  let filter = {};
  let fieldsToUpdate = {};
  // Loop through the keys in the request object
  for (const key in requestedfields) {
    if (Object.hasOwnProperty.call(requestedfields, key)) {
      const element = requestedfields[key];
      // Add the "_id" key to the filter object. This is how we'll tell the
      // database how to find the right record.
      if (key === "_id") {
        filter[key] = element;
        // And add the remaining keys to the fieldsToUpdate object. This is how
        // we'll tell the database what fields to update.
      } else {
        fieldsToUpdate[key] = element;
      }
    }
  }

  // Now try to find the record and update it based on the objects created above
  try {
    await User.findOneAndUpdate(
      filter,
      fieldsToUpdate,
      { new: true },
      function (err, doc) {
        if (err) {
          console.log("Something went wrong when updating the user.");
        }
        res.send("Updated");
      }
    );
  } catch (error) {
    console.log(error);
  }
};
