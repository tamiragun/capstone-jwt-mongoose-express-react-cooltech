// All the CRUD operations associated with the Credential model

let Credential = require("../models/Credentials.model");

// Create and save a new credential:

exports.addCredential = async function (req, res) {
  // Use the request body info to create a new document
  let credentialSchema = new Credential({
    name: req.body.name,
    login: req.body.login,
    email: req.body.email,
    password: req.body.password,
    org_unit: req.body.org_unit,
    division: req.body.division,
  });

  // Try adding the document to the collection
  try {
    await credentialSchema.save(function (err, credential) {
      if (err) {
        console.log("Error creating the credential");
        console.log(err);
        res.status(500).send({
          message: "Some error occurred while creating the credential.",
        });
      } else {
        console.log("Successfully added credential: ", credential.name);
        res.send({
          message: `Successfully added credential: ${credential.name}`,
        });
      }
    });
  } catch (error) {
    console.log("CATCH ERROR:", error);
  }
};

// Display all credentials:

exports.listAllCredentials = async function (req, res) {
  const filter = { org_unit: req.body.org_unit, division: req.body.division };
  try {
    await Credential.find(filter)
      // Sort by created date
      .sort("-created")
      .exec(function (err, credentials) {
        if (err) {
          console.log("Error listing credentials");
          console.log(err);
          res.status(500).send({
            message: "Some error occurred while retrieving credentials",
          });
        } else {
          console.log("Successfully displaying credentials");
          res.send(credentials);
        }
      });
  } catch (err) {
    console.log("CATCH ERROR:", err);
  }
};

// Find a single credential:

exports.findCredential = async function (req, res, next) {
  let filter = { _id: req.body._id };

  try {
    await Credential.findOne(filter).exec(function (err, credential) {
      if (err || credential === null) {
        console.log("Credential not found");
        res.status(500).send({ message: "Credential not found" });
      } else {
        req.credential = credential;
        console.log("successfully found credential: ", credential.name);
        next();
      }
    });
  } catch (error) {
    console.log("CATCH ERROR:", error);
  }
};

// Update a credential:

exports.updateCredential = async function (req, res) {
  const requestedfields = req.body;
  let fieldsToUpdate = {};

  for (const key in requestedfields) {
    const element = requestedfields[key];
    if (key !== "id") {
      fieldsToUpdate[key] = element;
    }
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    console.log("There are no fields to update");
    res.status(405).send({
      message: "Please indicate what to assign",
    });
  }

  try {
    await Credential.findOneAndUpdate(
      { _id: requestedfields._id },
      fieldsToUpdate,
      { new: true },
      function (err, credential) {
        if (err) {
          console.log("Something went wrong when updating the credential.");
        }
        console.log("Updated credential successfully: ", credential.name);
        res.send("Updated credential successfully");
      }
    );
  } catch (error) {
    console.log("CATCH ERROR:", error);
  }
};
