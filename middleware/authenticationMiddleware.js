const jwt = require("jsonwebtoken");

exports.authenticateNormal = async function (req, res, next) {
  //check for token
  if (!req.headers["authorization"]) {
    console.log("Authorization denied - no token");
    res.status(401).send({
      err: "Authorization denied - no token",
      msg: "You are not logged in. Try again.",
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
      console.log("Successfully verified role: ", decoded.role);
      // req.org_unit = decoded.org_unit;
      // req.division = decoded.division;
      req.affiliation = decoded.affiliation;
      //console.log(req.affiliation);
      next();
    } else {
      console.log("You do not have access to this resource.");
      res.status(403).send({ msg: "You do not have access to this resource." });
    }
  } catch (err) {
    console.log("CATCH ERR: Bad JWT!", err);
    res.status(401).send({ err: "Bad JWT!" });
  }
};

exports.authenticateManager = async function (req, res, next) {
  //check for token
  if (!req.headers["authorization"]) {
    console.log("Authorization denied - no token");
    res.status(401).send({
      err: "Authorization denied - no token",
      msg: "You are not logged in. Try again.",
    });
  }
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "jwt-secret");
    if (decoded.role === "manager" || decoded.role === "admin") {
      console.log("Successfully verified role: ", decoded.role);
      req.role = decoded.role;
      next();
    } else {
      console.log("You do not have access to this resource.");
      res.status(403).send({ msg: "You do not have access to this resource." });
    }
  } catch (err) {
    console.log("Bad JWT!");
    res.status(401).send({ err: "Bad JWT!" });
  }
};

exports.authenticateAdmin = async function (req, res, next) {
  //check for token
  if (!req.headers["authorization"]) {
    console.log("Authorization denied - no token");
    res.status(401).send({
      err: "Authorization denied - no token",
      msg: "You are not logged in. Try again.",
    });
  }
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "jwt-secret");
    if (decoded.role === "admin") {
      console.log("Successfully verified role: ", decoded.role);
      req.role = decoded.role;
      next();
    } else {
      console.log("You do not have access to this resource.");
      res.status(403).send({ msg: "You do not have access to this resource." });
    }
  } catch (err) {
    console.log("Bad JWT!");
    res.status(401).send({ err: "Bad JWT!" });
  }
};
