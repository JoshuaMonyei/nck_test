const express = require("express");

const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const { isLoggedIn, isAdmin, isUser } = require("../middlewares/auth");

// GET request to the database
router.get("/", (req, res) => res.status(200).json("Welcome to Favour Gallery built with Node.js "));

//  POST request to /inventorys to add a new product to inventory
router.post("/inventorys", isLoggedIn, isAdmin, inventoryController.createInventory);

// GET request to /inventorys to fetch all inventorys
router.get("/inventorys", isLoggedIn, inventoryController.fecthInventorys);

// GET request to /inventorys to fetch a single inventory
router.get("/inventorys/:id", isLoggedIn, inventoryController.fetchSingleInventory);

// PUT request to update a single inventory
router.put("/inventorys/:id", isLoggedIn, isAdmin, inventoryController.updateInventory);

// DELETE request to delete a single inventory
router.delete("/inventorys/:id", isLoggedIn, isAdmin, inventoryController.deleteSingleinventory);

// post request to add a product to cart
router.delete("/inventorys/addToCart/:id", isLoggedIn, isUser, inventoryController.buyInventory);

module.exports = router;
