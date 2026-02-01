const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// GET all orders with pagination & filter
router.get("/", async (req, res) => {
  const { status, page = 1, limit = 5 } = req.query;

  let filter = {};
  if (status) filter.status = status;

  const orders = await Order.find(filter)
    .populate("items.menuItem")
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  res.json(orders);
});

// GET single order
router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.menuItem");
  res.json(order);
});

// CREATE order
router.post("/", async (req, res) => {
  const order = new Order(req.body);
  order.orderNumber = "ORD" + Date.now();
  const saved = await order.save();
  res.json(saved);
});

// UPDATE order status
router.patch("/:id/status", async (req, res) => {
  const order = await Order.findById(req.params.id);
  order.status = req.body.status;
  await order.save();
  res.json(order);
});

module.exports = router;
