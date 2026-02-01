const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    description: String,
    category: {
      type: String,
      enum: ["Appetizer", "Main Course", "Dessert", "Beverage"],
      required: true,
    },
    price: { type: Number, required: true },
    ingredients: [String],
    isAvailable: { type: Boolean, default: true },
    preparationTime: Number,
    imageUrl: String,
  },
  { timestamps: true },
);

menuItemSchema.index({ name: "text", ingredients: "text" });

module.exports = mongoose.model("MenuItem", menuItemSchema);
