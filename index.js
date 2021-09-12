// The main entry point, that fires up the server

// require app, where all the endpoints are
var app = require("./app");
const port = process.env.PORT || 3001;

// Start listening on given port
app.listen(port, () =>
  console.log(`Now listening at http://localhost:${port}`)
);
