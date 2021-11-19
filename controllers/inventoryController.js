const inventory = require("../models/inventory");
const UserModel = require("../models/user");

exports.createInventory = async (req, res) => {
  const { name, price, quantity } = req.body;
  // check if inventory already exists
  const check = await inventory.findOne({ name });

  if (check) {
    return res
      .status(409)
      .json({ statusCode: 409, message: "Inventory already exists" });
  }
  //  Retrieving data from the POST request
  inventory.create(
    {
      name,
      price,
      quantity,
    },
    (err, newinventory) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Insert inventory full details", err });
      }

      res.status(200).json({ message: "New inventory created", newinventory });
    },
  );
};

exports.fecthInventorys = (req, res) => {
  inventory.find({}, (err, inventorys) => {
    if (err) {
      return res.status(500).json({ message: "Request not successful", err });
    }
    return res.status(200).json({ inventorys });
  });
};

exports.fetchSingleInventory = (req, res) => {
  inventory.findOne({ _id: req.params.id }, (err, result) => {
    if (!result) {
      return res.status(404).json({ message: "inventory not found" });
    }
    if (err) {
      return res.status(500).json({ message: err });
    }

    return res.status(200).json({ result });
  });
};

exports.updateInventory = async (req, res) => {
  const { name, price, quantity } = req.body;
  const { id } = req.params;
  // check if inventory already exists
  const check = await inventory.findOne({ _id: id });

  if (!check) {
    return res.status(404).json({ message: "Inventory not found" });
  }

  //  Retrieving data from the POST request
  inventory.updateOne(
    { _id: id },
    {
      name,
      price,
      quantity,
    },
    (err, savedInventory) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Update inventory full details", err });
      }

      res.status(200).json({ message: "Inventory updated", savedInventory });
    },
  );
};

exports.deleteSingleinventory = (req, res) => {
  inventory.findByIdAndDelete(req.params.id, (err, result) => {
    if (!result) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    if (err) {
      return res.status(500).json({ message: err });
    }

    return res.status(200).json({ message: "Inventory deleted" });
  });
};

exports.buyInventory = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  // check if inventory already exists
  const check = await inventory.findOne({ _id: id });

  if (!check) {
    return res.status(404).json({ message: "Inventory not found" });
  }

  if (check.quantity < quantity) {
    return res.status(400).json({ message: "Insufficient quantity" });
  }

  //  Retrieving data from the POST request
  inventory.updateOne(
    { _id: id },
    {
      $inc: { quantity: -quantity },
    },
    (err, savedInventory) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Update inventory full details", err });
      }
      UserModel.findOne({ id: req.user }, (error, user) => {
        if (error) {
          return res.status(500).json({ message: err });
        }
        // Add new item to the user cart array field
        const payload = { name: check.name, quantity, price: check.price };
        user.cart.push(payload);
        user.save();
      });

     return res.status(200).json({ message: "Inventory added to cart", savedInventory });
    },
  );
};
