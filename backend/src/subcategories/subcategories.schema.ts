import mongoose from "mongoose";
import { SubCategories } from "./subcategories.interface";

const subCategoriesSchema = new mongoose.Schema<SubCategories>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
      ref: "categories",
    },
    image: String,
  },
  { timestamps: true }
);

// replace id of category to data
subCategoriesSchema.pre<SubCategories>(/^find/, function (next) {
  this.populate({ path: "category" });
  next();
});

export default mongoose.model<SubCategories>(
  "subcategories",
  subCategoriesSchema
);
