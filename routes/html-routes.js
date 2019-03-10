// requiements
var path = require("path");
let db = require("../models");

module.exports = function (app) {
    // NEW HOME PAGE
    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/landingpage.html"));
    });

    app.get("/login", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/login.html"));
    });

    app.get("/signup", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/signup.html"));
    });

    app.get("*", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/landingpage.html"));
    });

};