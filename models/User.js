
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
//Schema ChartGo
//Model - User
var ChartGo = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    secretToken: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

var User = mongoose.model("User", ChartGo);

module.exports = User;

// encrypting password (hashing)
module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};
