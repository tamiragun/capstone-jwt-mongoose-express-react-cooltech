// The main entry point, that fires up the server

var app = require("./app");
const port = process.env.PORT || 3001;

// Start listening on given port
app.listen(port, () =>
  console.log(`Now listening at http://localhost:${port}`)
);
