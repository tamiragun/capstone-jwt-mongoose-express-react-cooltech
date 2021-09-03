const jwt = require("jsonwebtoken");

exports.authenticateNormal = async function (req, res, next) {
  //check for token
  if (!req.headers["authorization"]) {
    return res.status(401).json({
      err: "Authorization denied - no token",
      msg: "You are not logged in. Try again.",
    });
  }
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "jwt-secret");
    if (
      decoded.role === "normal" ||
      decoded.role === "manager" ||
      decoded.role === "admin"
    ) {
      next();
      console.log("verified role: ", decoded.role);
    } else {
      res.status(403).send({ msg: "You do not have access to this resource." });
    }
  } catch (err) {
    res.status(401).send({ err: "Bad JWT!" });
  }
};

exports.authenticateManager = async function (req, res, next) {
  //check for token
  if (!req.headers["authorization"]) {
    return res.status(401).json({
      err: "Authorization denied - no token",
      msg: "You are not logged in. Try again.",
    });
  }
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "jwt-secret");
    if (decoded.role === "manager" || decoded.role === "admin") {
      next();
      console.log("verified role: ", decoded.role);
    } else {
      res.status(403).send({ msg: "You do not have access to this resource." });
    }
  } catch (err) {
    res.status(401).send({ err: "Bad JWT!" });
  }
};

exports.authenticateAdmin = async function (req, res, next) {
  //check for token
  if (!req.headers["authorization"]) {
    return res.status(401).json({
      err: "Authorization denied - no token",
      msg: "You are not logged in. Try again.",
    });
  }
  const auth = req.headers["authorization"];
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "jwt-secret");
    if (decoded.role === "admin") {
      next();
      console.log("verified role: ", decoded.role);
    } else {
      res.status(403).send({ msg: "You do not have access to this resource." });
    }
  } catch (err) {
    res.status(401).send({ err: "Bad JWT!" });
  }
};
