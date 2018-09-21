var PORT = process.env.PORT || 8080;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongodb";

// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var Handlebars = require('handlebars');
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Scraping utilities
var axios = require("axios");
var cheerio = require("cheerio");

//Middleware
var app = express();
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Static Files
app.use(express.static("public"));

//Set Promise object for the ORM
mongoose.Promise = Promise;
//Connect to the Mongoose ORM
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

// Routes
require("./routes/routes.js")(app, axios, cheerio);

// Fire up the Server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

