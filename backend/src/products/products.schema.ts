import mongoose from "mongoose";
import { Products } from "./products.interface";

const ProductsSchema = new mongoose.Schema<Products>({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  category: {
    type: mongoose.Schema.ObjectId,
    ref: "categories",
  },

  subcategory: {
    type: mongoose.Schema.ObjectId,
    ref: "subcategories",
  },

  price: {
    type: Number,
    required: true,
  },

  discount: Number,

  priceAfterDiscount: Number,

  quantity: {
    type: Number,
    default: 0,
  },

  sold: {
    type: Number,
    default: 0,
  },

  rateAvg: {
    type: Number,
    default: 0,
  },

  rating: {
    type: Number,
    default: 0,
  },

  cover: String,
  images: Array<String>,
});

// Get Subcategory By ID
ProductsSchema.pre<Products>(/^find/, function (next) {
  this.populate({ path: "category" });
  next();
});

// Get Subcategory By ID
ProductsSchema.pre<Products>(/^find/, function (next) {
  this.populate({ path: "subcategory" });
  next();
});

export default mongoose.model<Products>("Products", ProductsSchema);
