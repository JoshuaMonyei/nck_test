const mongoose = require("mongoose");

// Create User schema
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user", "not assigned"],
        default: "user",
    },
    emailToken: String,
    isVerified: {
        type: Boolean,
        default: false,
    },
    cart: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "inventory",
        },
      ],

},
{
    timestamps: true,
});

module.exports = mongoose.model("User", UserSchema);
