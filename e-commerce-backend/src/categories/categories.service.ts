import { Request, Response } from "express";
import categoriesSchema from "./categories.schema";
import { Categories } from "./categories.interface";
import expressAsyncHandler from "express-async-handler";
// Service for Categories CRUD operations
class CategoriesService {
  // Get all categories from the database
  getAllCategories = expressAsyncHandler(
    async (req: Request, res: Response) => {
      const categories: Categories[] = await categoriesSchema.find();
      res.status(200).json({ data: categories });
    }
  );

  // Get One Category
  getOne = expressAsyncHandler(async (req: Request, res: Response) => {
    // request from the database
    const oneCategory: Categories | null = await categoriesSchema.findById(
      req.params.id
    );
    res.status(200).json({ data: oneCategory });
  });

  // Create a new category
  createCategory = expressAsyncHandler(async (req: Request, res: Response) => {
    const category: Categories = await categoriesSchema.create(req.body);
    res.status(201).json({ data: category });
  });

  // update one category
  update = expressAsyncHandler(async (req: Request, res: Response) => {
    const updateCategory: Categories | null =
      await categoriesSchema.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
    res.status(200).json({ data: updateCategory });
  });

  // Delete one category
  delete = expressAsyncHandler(async (req: Request, res: Response) => {
    const deleteCategory: Categories | null =
      await categoriesSchema.findByIdAndDelete(req.params.id);
    res.status(204).json();
  });
}

// Takeing Copy from the categoryService
const categoriesService = new CategoriesService();

// Exporting the categoriesService copied from the categoryService Class
export default categoriesService;
