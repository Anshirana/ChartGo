var express = require("express");
var router = express.Router();
var User = require("../models/User");
var mailer = require("../misc/mailer");
var randomstring = require("randomstring");
var mongoose = require("mongoose");
/* GET signup page. */
router.get("/", function (req, res, next) {
  res.render("signup");
});
// Signup POst Handle
router.post("/", (req, res) => {
  let errors = [];
  User.findOne({ email: req.body.email }, function (
    err,
    user
  ) {
    if (err) {
      //handle eror here
      res.render("signup", {
        errors,
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: req.body.password,
        password2,
      });
    }
    //if a user was found, that means the user's email matches the entered email
    if (user) {
      //SAP ID exists
      errors.push({ msg: "User is already registered" });
      res.render("signup", {
        errors,
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: req.body.password,
      });
    } else {
      //////////////////////////////////////////////
      //Generate secret Token
      var secretToken = randomstring.generate({
        length: 6,
        charset: "hex",
        capitalization: "uppercase",
      });
      req.body.secretToken = secretToken;
      //Flag the account as inactive
      req.body.active = false;
      ////////////////////////////////////////////////////////////////////////////////////////
      //code if no user with entered email was found
      var newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: req.body.password,
        secretToken: req.body.secretToken,
        active: req.body.active,
      });
      //Hashing Password & Saving User
      User.createUser(newUser, function (err, user) {
        if (err) throw err;
      });
      //-----------------------nodemailer-------------------------------//
      var output = `
               Hi there,
               <br/>
               Welcome <b>${req.body.fname} ${req.body.lname} </b>,to ChartGO!
               <br/>
               Please verify your email by entering the following code.
               Here is your token for verification :-
               <br/>
               <h3> <b>TOKEN: ${secretToken}</b> </h3>
               <br/>
               Enjoy!!...Have a pleasent day`;
      //send the mail
      mailer.sendEmail(
        '"ASCW" <ascw.upes@gmail.com>',
        req.body.email,
        "Please verfiy to login ChartGo",
        output
      );
      //     ///////////////////////////////////////////////////////////////
      req.flash(
        "success_msg",
        "You're registered successfully. Check your email for verification Code"
      );
      res.redirect("/verify");
    }
  });
});

module.exports = router;
