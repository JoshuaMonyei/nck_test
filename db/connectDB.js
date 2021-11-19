// Mongoose set-up
const mongoose = require("mongoose");
require("dotenv").config();

const connectionString = process.env.MONGODB_URI; // || "mongodb://localhost/nck_test;

// connection string to database
function connectDB() {
    mongoose.connect(connectionString, (err) => {
        if (err) {
            throw err;
        } else { console.log("Database connection established"); }
    });
}

module.exports = connectDB;
