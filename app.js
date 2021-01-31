var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");
var session = require("express-session");

var app = express();

//passport Config
require("./config/passport")(passport);
//DB Config
var db = require("./config/keys").MongoURI;

//Connect to Mongodb
mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

var PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server Strated on Port: ${PORT}`));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect-Flash
app.use(flash(app));

//Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/index"));
app.use("/bar", require("./routes/bar"));
app.use("/line", require("./routes/line"));
app.use("/pie", require("./routes/pie"));
app.use("/signup", require("./routes/signup"));
app.use("/signin", require("./routes/signin"));
app.use("/verify", require("./routes/verify"));
app.use("/logout", require("./routes/logout"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
