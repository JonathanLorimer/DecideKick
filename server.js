"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

const randomUrl = require("./routes/utilities/randomUrl.js");
const cookieSession = require('cookie-session')

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000
}))

// Mount all resource routes
// app.use("/api/users", usersRoutes(knex));



app.get("/", (req, res) => {
  res.render("./index")
})

app.post("/", (req, res) => {
  //collect email from HTML input, save it to the data base on [admin:email]
  //create a cookie with email information
  res.redirect("/index/create")
})

app.get("/create", (req, res) => {
  res.render("./create")
})

app.post("/create", (req, res) => {
  //collect information from HTML text inputs, save it to the data base [poll: title, subject, question, anwsers]
  //call function to generate random URL - twice 
  //randomUrl()
  //send email for using the saved cookie
  res.redirect("/create/confirmation")
})

app.get("/create/confirmation", (req, res) => {
  //delete all cookies generated
  res.render("./confirmation")
})

app.get("/survey/:user_survey_id", (req, res) => {
  //we might have to use EJS at this point
  res.render("./survey")
})

app.post("/survey/:user_survey_id", (req, res) => {
  //collect informations from drag-and-drop
  //run the function to do the math of the results
  //save the results in database
  res.redirect("/survey/confirmation")
})

app.get("/survey/:admin_survey_id"){
  //collect information from DB
  //convert the data for percentage
  //sort the collection for display
}


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
  console.log("Testing commit changes");
});
