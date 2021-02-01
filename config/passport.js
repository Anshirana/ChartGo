var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcryptjs");

//load User Model
var User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: false,
      },
      (email, password, done) => {
        //Match User
        User.findOne({ email: email })
          .then((user) => {
            //(1)Check if the email is registered or not
            if (!user) {
              return done(null, false, {
                message: "That User is not registered",
              });
            } else {
              // (2)Check if the password is correct or not
              bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                  //(3)Check if the email account is been verified or not
                  if (!user.active) {
                    return done(null, false, {
                      message: "You need to verify your email first",
                    });
                  } else {
                    return done(null, user);
                  }
                } else {
                  return done(null, false, { message: "Password Incorrect" });
                }
              });
            }
          })
          .catch((err) => console.log(err));
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
