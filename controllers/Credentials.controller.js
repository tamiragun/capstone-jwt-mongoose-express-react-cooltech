// All the CRUD operations associated with the Credential model

let Credential = require("../models/Credentials.model");

// Method to create and save a new credential. Requires body params of
// name, login, password, organisational unit and division. If successfull,
// it sends a success message to the client.
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
      // In the case of any errors, send the client an object with the "error"
      // key set and a message for the user.
      if (error) {
        console.log(
          "Credentials.controller.addCredential: Error creating the credential: ",
          error
        );
        res.status(500).send({
          error: error,
          message: "We couldn't create this credential.",
        });
        // If successful, pass success message on to client
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

// Method to display all credentials of a given affiliation. Requires body
// params of an affiliation. If successfull, it sends all matching credentials
// to the client.

exports.listAllCredentials = async function (req, res) {
  // Create the filter based on the affiliation in the body params
  const filter = {
    org_unit: req.body.affiliation.org_unit,
    division: req.body.affiliation.division,
  };

  // Try finding all credentials matching that filter.
  try {
    Credential.find(filter)
      .sort("-created")
      .exec(function (error, credentials) {
        // In the case of any errors, send the client an object with the "error"
        // key set and a message for the user.
        if (error) {
          console.log(
            "Credentials.controller.listAllCredentials: Error listing credentials: ",
            error
          );
          res.status(500).send({
            error: error,
            message: "We couldn't retrieve the credentials from the database.",
          });
          // If successful, send list of credentials on to client
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

// Method to find a single credential. Requires body params of
// credential id. If successfull, it sends the credential to the client.

exports.findCredential = async function (req, res) {
  let filter = { _id: req.body._id };

  try {
    Credential.findOne(filter).exec(function (error, credential) {
      // In the case of any errors, send the client an object with the "error"
      // key set and a message for the user.
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
        // If successful, send credential to the client
      } else {
        console.log(
          "Credentials.controller.findCredential: Successfully found credential: ",
          credential.name
        );
        res.send(credential);
      }
    });
  } catch (error) {
    console.log("Credentials.controller.findCredential: Catch error:", error);
  }
};

// Method to update a credential. Requires body params including an object with
// the credential id and fields to update. If successfull, it sends a message to the client.

exports.updateCredential = async function (req, res) {
  // Get the object from the body params
  const requestedfields = req.body;
  let fieldsToUpdate = {};

  // Loop through the keys in the object and build up a new object with fields to update.
  for (const key in requestedfields) {
    const element = requestedfields[key];
    if (key !== "id") {
      fieldsToUpdate[key] = element;
    }
  }

  // Make sure the object with fields to update is not empty
  if (Object.keys(fieldsToUpdate).length === 0) {
    // If it is still empty, send back an error to the client.

    console.log(
      "Credentials.controller.updateCredential: There are no fields to update"
    );
    res.status(405).send({
      error: "Credentials.controller.updateCredential: custom error",
      message:
        "There were no fields to update. Please indicate what to update.",
    });
  }
  // If not, perform the database action:
  try {
    Credential.findOneAndUpdate(
      // Filter by the user id provided in the body params
      { _id: requestedfields._id },
      // Apply the object with fields to update here
      fieldsToUpdate,
      { new: true },
      function (error, credential) {
        // In the case of any errors, send the client an object with the "error"
        // key set and a message for the user.
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
        // If successful, pass success message on to client
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
