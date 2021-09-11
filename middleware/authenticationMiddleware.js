const jwt = require("jsonwebtoken");

exports.authenticateNormal = async function (req, res, next) {
  //check for token
  if (!req.headers["authorization"]) {
    console.log(
      "authenticationMiddleware.AuthenticateNormal: Authorization denied - no token"
    );
    res.status(401).send({
      error: "authenticationMiddleware.AuthenticateNormal: custom error",
      message: "You are not logged in. Please try again.",
    });
  }
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "jwt-secret");
    //console.log(decoded.affiliation);
    if (
      decoded.role === "normal" ||
      decoded.role === "manager" ||
      decoded.role === "admin"
    ) {
      console.log(
        "authenticationMiddleware.AuthenticateNormal: Successfully verified role: ",
        decoded.role
      );
      req.affiliation = decoded.affiliation;
      req.role = decoded.role;
      next();
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

exports.authenticateManager = async function (req, res, next) {
  //check for token
  if (!req.headers["authorization"]) {
    console.log(
      "authenticationMiddleware.AuthenticateManager: Authorization denied - no token"
    );
    res.status(401).send({
      error: "authenticationMiddleware.AuthenticateManager: custom error",
      message: "You are not logged in. Please try again.",
    });
  }
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "jwt-secret");
    if (decoded.role === "manager" || decoded.role === "admin") {
      console.log(
        "authenticationMiddleware.AuthenticateManager: Successfully verified role: ",
        decoded.role
      );
      req.affiliation = decoded.affiliation;
      req.role = decoded.role;
      next();
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

exports.authenticateAdmin = async function (req, res, next) {
  //check for token
  if (!req.headers["authorization"]) {
    console.log(
      "authenticationMiddleware.AuthenticateAdmin: Authorization denied - no token"
    );
    res.status(401).send({
      error: "authenticationMiddleware.AuthenticateAdmin: custom error",
      message: "You are not logged in. Please try again.",
    });
  }
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "jwt-secret");
    if (decoded.role === "admin") {
      console.log(
        "authenticationMiddleware.AuthenticateAdmin: Successfully verified role: ",
        decoded.role
      );
      req.affiliation = decoded.affiliation;
      req.role = decoded.role;
      next();
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

exports.checkAffiliation = async function (req, res, next) {
  // SHOULD I ADD A CHECK IF REQ.AFFILIATION IS SET? YES

  const checkAffiliation = req.affiliation.filter((element) => {
    if (JSON.stringify(element) === JSON.stringify(req.body.affiliation)) {
      return element;
    }
  });

  if (checkAffiliation.length > 0) {
    console.log(
      "authenticationMiddleware.checkAffiliation: Successfully verified that user is in this org_unit and division"
    );
    next();
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

exports.checkEditPermission = async function (req, res) {
  // SHOULD I ADD A CHECK IF REQ.ROLE IS SET?
  if (req.role === "manager" || req.role === "admin") {
    console.log(
      "authenticationMiddleware.checkEditPermission: Successfully granted permission to display edit credential buttons"
    );
    res.send({ access: true });
  }
};
