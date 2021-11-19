const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { successResponse, errorResponse } = require("../utils/responseHandlers");
const User = require("../models/user");

require("dotenv").config();

const expiry = 84600;

// @route   POST /register
// @desc    Register user and get email verification
// @access  public route
exports.signup = async (req, res, next) => {
  try {
    // destructuring user details from req body
    const { name, email, password } = req.body;
    const duplicatedUser = await User.findOne({ email });
    if (duplicatedUser) {
      return res.status(409).json({ message: "User with the email already exists" });
    }
    const emailToken = crypto.randomBytes(64).toString("hex");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      password: hashedPassword,
      email,
      isVerified: true,
      emailToken,
    });
    // SMTP transporter for nodemailer
    // const transporter = nodemailer.createTransport({
    //   service: "hotmail",
    //   auth: {
    //     user: process.env.MAIL_FROM,
    //     pass: process.env.MAIL_PASSWORD,
    //   },
    // });
    // Mail structure and contents.
    // const mailOptions = {
    //   from: process.env.MAIL_FROM,
    //   to: email,
    //   subject: "Favour Gallery - verify your email",
    //   html: `
    //         <h1>Hello,</h1>
    //         <p>Thanks for registering on our site.</p>
    //         <P>Please click the link below to verify your account</p>
    //         <a href= "http://${req.headers.host}/verify-email?token=${emailToken}">Verify your account</a>`,
    // };
    // // Send confirmation mail to user after successful registration
    // transporter.sendMail(mailOptions, (err, info) => {
    //   if (err) {
    //     return errorResponse(res, "Couldn't send mail, contact us for assistance", 500);
    //   }
    // });
    return res.status(200).json({ message: "User successfully registered" });
  } catch (error) {
    return errorResponse(res, "Something went wrong", 500);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ emailToken: req.query.token });
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }
    // deleting verified user emailToken in the DB
    user.emailToken = null;
    // change user .isVerified value to true
    user.isVerified = true;
    await user.save();
    return successResponse(res, 200, "Email verified successfully");
  } catch (error) {
    return errorResponse(res, "Failed to verify mail", 500);
  }
};

// @route   POST /login
// @desc    Auth user and get token
// @access  public route
exports.login = async (req, res, next) => {
  // check for errors in email input
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, "Invalid input", 422);
  }
  // else
  try {
    User.findOne({ email: req.body.email }, (err, confirmedUser) => {
      if (!confirmedUser) {
        return errorResponse(res, "Invalid email, You're yet to be registered", 401);
      }
      // check if registered has verified emailToken
      if (!confirmedUser.isVerified) {
        return errorResponse(res, "Please verify your email to login", 400);
      }
      // check password is correct
      const isMatch = bcrypt.compareSync(
        req.body.password,
        confirmedUser.password,
      );
      if (!isMatch) {
        return errorResponse(res, "Email and password do not match", 400);
      }
      jwt.sign({
          id: confirmedUser.id,
          name: confirmedUser.name,
        },
        process.env.SECRET,
        {
          expiresIn: expiry,
        },
        (error, token) => {
          res.cookie("token", token, {
            expires: new Date(Date.now() + 43200000),
            secure: false, // set to true if your using https
            httpOnly: true,
          });
        });
        return successResponse(res, 200, "Logged in successfully");
    });
  } catch (error) {
    return errorResponse(res, "Something went wrong", 500);
  }
};

exports.logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(Date.now() + 1),
  });
  return successResponse(res, 201, "Logged out");
};

exports.updateProfile = async (req, res) => {
  // remove all fields in the update object with undefined as the value
  try {
    const updateObj = Object.keys(req.body).reduce((acc, key) => {
        // eslint-disable-next-line no-underscore-dangle
        const _acc = acc;
        if (req.body[key] !== "") {
            _acc[key] = req.body[key];
        }
        return _acc;
        }, {});
        const updatedUser = await User.findOneAndUpdate(
        { id: req.user.id },
        updateObj,
        );
        return successResponse(res, 201, "Successfully updated user details");
  } catch (error) {
        return errorResponse(res, "Failed to update user details", 500);
    }
};

exports.fetchCart = async (req, res) => {
    try {
        const cart = await User.findOne({ id: req.user.id }).populate("cart");
        return successResponse(res, 200, cart.cart);
    } catch (error) {
        return errorResponse(res, "Failed to fetch cart", 500);
    }
};
