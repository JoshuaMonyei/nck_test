const mongoose = require("mongoose");

// database schema with the required input
const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: String,
});

module.exports = mongoose.model("inventory", inventorySchema);
