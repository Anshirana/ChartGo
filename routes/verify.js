var express = require('express');
var router = express.Router();
var User = require("../models/User");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('verify');
});

router.post("/", (req, res) => {
    //Find the account that matches the secret token
    User.findOne({ secretToken: req.body.secretToken }, (err, user) => {
        if (!user) {
            req.flash("error_msg", "Invalid secret token.");
            res.redirect("/verify");
            return;
        }
        user.active = true;
        user.secretToken = "Account Verified";
        user.save();
        req.flash("success_msg", "Your account is verified & you can login now");
        res.redirect("/signin");
    });
});
module.exports = router;
