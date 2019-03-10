var express = require("express");
var routes = require('./routes/api-routes');
// var htmlRoutes = require('./routes/html-routes');
var app = express();
var PORT = process.env.PORT || 8080;

var db = require("./models");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory
app.use(express.static("public"));

// Routes
// =============================================================
// require("./routes/api-routes.js")(app);
app.use(routes);
require("./routes/html-routes.js")(app);  // HTML ROUTES ~JG



db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
