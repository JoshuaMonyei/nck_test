const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const password = "admin123";

exports.seedAdmin = () => {
    // check if an admin account exists
    User.findOne({ role: "admin" }, (err, admin) => {
        if (err) throw err;
        if (admin) {
          return;
        }
        // Create Admin account
        const user = new User({
            name: "admin",
            email: "admin@gmail.com",
            password,
            role: "admin",
            isVerified: true,
        });

        // hash users password
        bcrypt.genSalt(10, (fail, salt) => {
            if (fail) throw fail;
            bcrypt.hash(user.password, salt, (error, hash) => {
                if (error) throw error;
                user.password = hash;
                user.save((errorr, savedUser) => {
                    if (errorr) throw errorr;
                });
            });
        });
    });
};
