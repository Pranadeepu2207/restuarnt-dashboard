const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");

// GET all menu items with filters
router.get("/", async (req, res) => {
  try {
    const { category, isAvailable, minPrice, maxPrice } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (isAvailable) filter.isAvailable = isAvailable === "true";
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }

    const items = await MenuItem.find(filter);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching menu" });
  }
});

// SEARCH menu items
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q;

    if (!q || q.trim() === "") {
      return res.json([]);
    }

    const results = await MenuItem.find({
      $text: { $search: q },
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
});

// GET single item
router.get("/:id", async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  res.json(item);
});

// CREATE item
router.post("/", async (req, res) => {
  const item = new MenuItem(req.body);
  const saved = await item.save();
  res.json(saved);
});

// UPDATE item
router.put("/:id", async (req, res) => {
  const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// DELETE item
router.delete("/:id", async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// TOGGLE availability
router.patch("/:id/availability", async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  item.isAvailable = !item.isAvailable;
  await item.save();
  res.json(item);
});

module.exports = router;
