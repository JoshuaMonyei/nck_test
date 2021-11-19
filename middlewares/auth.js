const jwt = require("jsonwebtoken");
require("dotenv").config();

const { SECRET } = process.env;

exports.isLoggedIn = async (req, res, next) => {
    // check if there is an authentication token
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ message: "No access, You are not logged in" });
    }
    // decode token and check if valid
    jwt.verify(token, SECRET, (err, decodedToken) => {
        if (err) return res.status(500).json({ err });
        if (!decodedToken) {
            return res.status(500).json({ message: "Invalid authorization token, please login" });
        }
        // allow user to continue the request
        req.user = decodedToken;
        next();
    });
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({ message: "Route is restricted to Admin users only" });
    }
    return next();
};

exports.isUser = (req, res, next) => {
    if (req.user.role !== "user") {
        return res.status(401).json({ message: "Route is restricted to Users only" });
    }
    return next();
};
