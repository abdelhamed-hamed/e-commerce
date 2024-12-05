import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import subcategoriesSchema from "./subcategories.schema";
import { SubCategories } from "./subcategories.interface";
class SubCategoriesService {
  setCategoryId(req: Request, res: Response, next: NextFunction) {
    if (req.params.categoryId && !req.body.category)
      req.body.category = req.params.categoryId;
    next();
  }
  filterSubcategories(req: Request, res: Response, next: NextFunction) {
    const filterData: any = {};
    if (req.params.categoryId) filterData.category = req.params.categoryId;
    req.filterData = filterData;
    next();
  }

  // Gett All SubCategories
  getAll = expressAsyncHandler(async (req: Request, res: Response) => {
    let filterData: any = {};
    if (req.filterData) filterData = req.filterData;
    const subcategories = await subcategoriesSchema.find();
    res.status(200).json({ date: subcategories });
  });

  // Get One SubCategories
  getOne = expressAsyncHandler(async (req: Request, res: Response) => {
    const subCategory: SubCategories | null =
      await subcategoriesSchema.findById(req.params.id);
    res.status(200).json({ date: subCategory });
  });

  // Create SubCategories
  create = expressAsyncHandler(async (req: Request, res: Response) => {
    const subCategory = await subcategoriesSchema.create(req.body);
    res.status(201).json({ data: subCategory });
  });

  // Update SubCategory
  update = expressAsyncHandler(async (req: Request, res: Response) => {
    const updatedSubCategory: SubCategories | null =
      await subcategoriesSchema.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
    res.status(200).json({ data: updatedSubCategory });
  });

  // Delete SubCategory
  delete = expressAsyncHandler(async (req: Request, res: Response) => {
    const deletedSubCategory: SubCategories | null =
      await subcategoriesSchema.findByIdAndDelete(req.params.id);
    res.status(204).json();
  });
}

const subCategoriesService = new SubCategoriesService();

export default subCategoriesService;
