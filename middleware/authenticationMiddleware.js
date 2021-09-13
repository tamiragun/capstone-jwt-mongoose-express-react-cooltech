// Contains all the express middleware that handles authentication of users

const jwt = require("jsonwebtoken");

// Authentication that passes if a user's role is 'normal', 'manager' or 'admin'.
// Requires the authentication header to be set.
// If successful, it also adds the user's role and affiliation to the
// request object before passing to the next express middleware.

exports.authenticateNormal = async function (req, res, next) {
  // Check for token
  if (!req.headers["authorization"]) {
    console.log(
      "authenticationMiddleware.AuthenticateNormal: Authorization denied - no token"
    );
    res.status(401).send({
      error: "authenticationMiddleware.AuthenticateNormal: custom error",
      message: "You are not logged in. Please try again.",
    });
  }

  // Decode the token
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Check for the "role" property on the token payload
    if (
      decoded.role === "normal" ||
      decoded.role === "manager" ||
      decoded.role === "admin"
    ) {
      console.log(
        "authenticationMiddleware.AuthenticateNormal: Successfully verified role: ",
        decoded.role
      );

      // Add the role and affiliation from the payload to the request body
      req.affiliation = decoded.affiliation;
      req.role = decoded.role;

      // Pass on to the next middleware
      next();

      // If anything fails, send back an object with the key "error" set
      // and an accompanying user-friendly error message that will be displayed.
    } else {
      console.log(
        "authenticationMiddleware.AuthenticateNormal: You do not have access to this resource."
      );
      res.status(403).send({
        error: "authenticationMiddleware.AuthenticateNormal: custom error",
        message: "You do not have access to this resource.",
      });
    }
  } catch (error) {
    console.log(
      "authenticationMiddleware.AuthenticateNormal: Catch error: ",
      error
    );
    res.status(401).send({
      error: error,
      message: "We were not able to verify your access for this resource.",
    });
  }
};

// Authentication that passes if a user's role is 'manager' or 'admin'.
// Requires the authentication header to be set.
// If successful, it also adds the user's role and affiliation to the
// request object before passing to the next express middleware.

exports.authenticateManager = async function (req, res, next) {
  // Check for token
  if (!req.headers["authorization"]) {
    console.log(
      "authenticationMiddleware.AuthenticateManager: Authorization denied - no token"
    );
    res.status(401).send({
      error: "authenticationMiddleware.AuthenticateManager: custom error",
      message: "You are not logged in. Please try again.",
    });
  }

  // Decode the token
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Check for the "role" property on the token payload
    if (decoded.role === "manager" || decoded.role === "admin") {
      console.log(
        "authenticationMiddleware.AuthenticateManager: Successfully verified role: ",
        decoded.role
      );

      // Add the role and affiliation from the payload to the request body
      req.affiliation = decoded.affiliation;
      req.role = decoded.role;

      // Pass on to the next middleware
      next();

      // If anything fails, send back an object with the key "error" set
      // and an accompanying user-friendly error message that will be displayed.
    } else {
      console.log(
        "authenticationMiddleware.AuthenticateManager: You do not have access to this resource."
      );
      res.status(403).send({
        error: "authenticationMiddleware.AuthenticateManager: custom error",
        message: "You do not have access to this resource.",
      });
    }
  } catch (error) {
    console.log(
      "authenticationMiddleware.AuthenticateManager: Catch error: ",
      error
    );
    res.status(401).send({
      error: error,
      message: "We were not able to verify your access for this resource.",
    });
  }
};

// Authentication that passes if a user's role is 'admin'.
// Requires the authentication header to be set.
// If successful, it also adds the user's role and affiliation to the
// request object before passing to the next express middleware.
exports.authenticateAdmin = async function (req, res, next) {
  // Check for token
  if (!req.headers["authorization"]) {
    console.log(
      "authenticationMiddleware.AuthenticateAdmin: Authorization denied - no token"
    );
    res.status(401).send({
      error: "authenticationMiddleware.AuthenticateAdmin: custom error",
      message: "You are not logged in. Please try again.",
    });
  }

  // Decode the token
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Check for the "role" property on the token payload
    if (decoded.role === "admin") {
      console.log(
        "authenticationMiddleware.AuthenticateAdmin: Successfully verified role: ",
        decoded.role
      );

      // Add the role and affiliation from the payload to the request body
      req.affiliation = decoded.affiliation;
      req.role = decoded.role;

      // Pass on to the next middleware
      next();

      // If anything fails, send back an object with the key "error" set
      // and an accompanying user-friendly error message that will be displayed.
    } else {
      console.log(
        "authenticationMiddleware.AuthenticateAdmin: You do not have access to this resource."
      );
      res.status(403).send({
        error: "authenticationMiddleware.AuthenticateAdmin: custom error",
        message: "You do not have access to this resource.",
      });
    }
  } catch (error) {
    console.log(
      "authenticationMiddleware.AuthenticateAdmin: catch error: ",
      error
    );
    res.status(401).send({
      error: error,
      message: "We were not able to verify your access for this resource.",
    });
  }
};

// Authentication that passes if a user's list of affiliations contains
// the affiliation provided in the body params.
// Requires the body params to have an affiliation object, and the request
// object to have an affiliation property. If there is a match, it passes
// on to the next middleware without altering the request object.
exports.checkAffiliation = async function (req, res, next) {
  // TODO: ADD A CHECK IF REQ.AFFILIATION IS SET

  // Chcck that the list of affiliations on the request object contains the
  // affiliation object provided in the body params.
  // Do the check by filtering the array to contain only elements where there
  // is a match between the element and the provided affiliation.
  const checkAffiliation = req.affiliation.filter((element) => {
    if (JSON.stringify(element) === JSON.stringify(req.body.affiliation)) {
      return element;
    }
  });

  // If there is a match, i.e. the filtered list has an item in it, pass on
  // to the next middleware.

  if (checkAffiliation.length > 0) {
    console.log(
      "authenticationMiddleware.checkAffiliation: Successfully verified that user is in this org_unit and division"
    );
    next();

    // If there is no match, or something goes wrong, provide an object with error
    // key and message for the user.
  } else {
    console.log(
      "authenticationMiddleware.checkAffiliation: User does not belong to this org_unit or division"
    );
    res.status(403).send({
      error: "authenticationMiddleware.checkAffiliation: Custom error",
      message: "You do not have permission to view these credentials.",
    });
  }
};

// Authentication that passes if a user's role is manager or admin.
// Requires the request object to have a "role" property. If there is a match,
// it returns an object to the client with an "access" key set to true.
exports.checkEditPermission = async function (req, res) {
  // TODO: ADD A CHECK IF REQ.ROLE IS SET
  if (req.role === "manager" || req.role === "admin") {
    console.log(
      "authenticationMiddleware.checkEditPermission: Successfully granted permission to display edit credential buttons"
    );
    res.send({ access: true });
  }
};
