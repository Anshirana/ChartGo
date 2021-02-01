var express = require("express");
var router = express.Router();
// var { ensureAuthenticated } = require('../config/auth');

router
    .use(function (req, res, next) {
        res.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
        res.set("Expires", "-1");
        res.set("Pragma", "no-cache");
        next();
    })
    .get("/", (req, res) => {
        req.session.destroy();
        res.redirect("/signin");
    });

module.exports = router;
