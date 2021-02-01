var express = require('express');
var router = express.Router();
var flash = require("connect-flash");
var passport = require("passport");

router
    .use(function (req, res, next) {
        res.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
        res.set("Expires", "-1");
        res.set("Pragma", "no-cache");
        next();
    })
    .get("/", (req, res, next) => {
        res.render("signin");
    });

//Login Handle
router.post("/", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/signin",
        failureFlash: true,
    })(req, res, next);
});

module.exports = router;
