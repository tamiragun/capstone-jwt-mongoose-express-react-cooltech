// The server with all the endpoints and middleware

const express = require("express");
const path = require("path");
const logger = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

//Middelware to help with parsing, logging, security
app.use(express.json());
app.use(logger("dev"));
app.use(helmet());

//Disable CORS
app.use((req, res, next) => {
  res.header({ "Access-Control-Allow-Origin": "*" });
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

//Routes

const userRouter = require("./routes/users");
app.use("/users", userRouter);

const authRouter = require("./routes/authentication");
app.use("/authentication", authRouter);

// All the API endpoints, which correspond to a controller function each
//app.get("/display", JobControllers.listAllJobs);
//app.post("/add", JobControllers.addNewJob);
//app.patch("/update", JobControllers.updateJob);
//app.patch("/bulkupdate", JobControllers.updateStatus);

// Connecting the app to the database using hidden keys
const uri = `mongodb+srv://${process.env.ATLAS_LOGIN}:${process.env.ATLAS_PASSWORD}@hyperiondev.v2pxn.mongodb.net/cool-tech`;
mongoose.Promise = global.Promise;

mongoose.connect(uri, {
  //Commenting these out because they are 'not supported' and were causing the conenction to fail
  //useMongoClient: true,
  //useNewUrlParser: true,
  //useUnifiedTypology: true,
});

mongoose.connection.on("error", (err) => {
  console.log("Could not connect to the database. Exiting now...");
  console.log(err);
  process.exit();
});

mongoose.connection.once("open", function () {
  console.log("Successfully connected to the database");
});

// Export app to use it in index.js, the main entry point
module.exports = app;
