// All the CRUD operations associated with the Credential model

let Credential = require("../models/Credentials.model");

// Create and save a new credential:

exports.addCredential = async function (req, res) {
  // Use the request body info to create a new document
  let credentialSchema = new Credential({
    name: req.body.name,
    login: req.body.login,
    password: req.body.password,
    org_unit: req.body.org_unit,
    division: req.body.division,
  });

  // Try adding the document to the collection
  try {
    await credentialSchema.save(function (error, credential) {
      if (error) {
        console.log(
          "Credentials.controller.addCredential: Error creating the credential: ",
          error
        );
        res.status(500).send({
          error: error,
          message: "We couldn't create this credential.",
        });
      } else {
        console.log(
          "Credentials.controller.addCredential: Successfully added credential: ",
          credential.name
        );
        res.send({
          message: `We successfully added credential: ${credential.name}`,
        });
      }
    });
  } catch (error) {
    console.log("Credentials.controller.addCredential: Catch error:", error);
  }
};

// Display all credentials:

exports.listAllCredentials = async function (req, res) {
  const filter = {
    org_unit: req.body.affiliation.org_unit,
    division: req.body.affiliation.division,
  };
  //console.log(filter);
  try {
    Credential.find(filter)
      .sort("-created")
      .exec(function (error, credentials) {
        if (error) {
          console.log(
            "Credentials.controller.listAllCredentials: Error listing credentials: ",
            error
          );
          res.status(500).send({
            error: error,
            message: "We couldn't retrieve the credentials from the database.",
          });
        } else {
          console.log(
            `Credentials.controller.listAllCredentials: Successfully displaying ${credentials.length} credentials`
          );
          res.send(credentials);
        }
      });
  } catch (error) {
    console.log(
      "Credentials.controller.listAllCredentials: Catch error:",
      error
    );
  }
};

// Find a single credential:

exports.findCredential = async function (req, res, next) {
  let filter = { _id: req.body._id };

  try {
    Credential.findOne(filter).exec(function (error, credential) {
      if (credential === null) {
        console.log(
          "Credentials.controller.findCredential: Credential not found"
        );
        res
          .status(500)
          .send({ error: "Custom error", message: "Credential not found" });
      } else if (error) {
        console.log("Credentials.controller.findCredential: ", error);
        res.status(500).send({
          error: error,
          message: "We couldn't find credential in the database.",
        });
      } else {
        req.credential = credential;
        console.log(
          "Credentials.controller.findCredential: Successfully found credential: ",
          credential.name
        );
        next();
      }
    });
  } catch (error) {
    console.log("Credentials.controller.findCredential: Catch error:", error);
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
    console.log(
      "Credentials.controller.updateCredential: There are no fields to update"
    );
    res.status(405).send({
      error: "Credentials.controller.updateCredential: custom error",
      message:
        "There were no fields to update. Please indicate what to update.",
    });
  }

  try {
    Credential.findOneAndUpdate(
      { _id: requestedfields._id },
      fieldsToUpdate,
      { new: true },
      function (error, credential) {
        if (error) {
          console.log(
            "Credentials.controller.updateCredential: Something went wrong when updating the credential: ",
            error
          );
          res.status(500).send({
            error: error,
            message: "We couldn't update this credential.",
          });
        }
        console.log(
          "Credentials.controller.updateCredential: Updated credential successfully: ",
          credential.name
        );
        res.send({
          message: "We updated the credential successfully.",
        });
      }
    );
  } catch (error) {
    console.log(
      "Credentials.controller.updateCredential: Catch error: ",
      error
    );
  }
};
