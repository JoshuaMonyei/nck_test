const express = require("express");
const User = require("../models/user");

const router = express.Router();

// import user controller
const userController = require("../controllers/userController");

// handle signup logic
router.post("/register", userController.signup);

// route for email confirmation
router.get("/verify-email", userController.verifyEmail);

// handles login logic
router.post("/login", userController.login);

// Logout Handler
router.get("/logout", userController.logout);

// update user profile
router.put("/update-profile", userController.updateProfile);

// fetch user cart
router.get("/cart", userController.fetchCart);

module.exports = router;
