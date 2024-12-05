import { Router } from "express";
import categoriesService from "./categories.service";
import subcategoriesRouter from "../subcategories/subcategories.route";
const categoriesRouter: Router = Router();

// Get Subcategories by Category
categoriesRouter.use("/:categoryId/subcategories", subcategoriesRouter);

categoriesRouter
  .route("/")
  .get(categoriesService.getAllCategories)
  .post(categoriesService.createCategory);

categoriesRouter
  .route("/:name")
  .get(categoriesService.getOne)
  .put(categoriesService.update)
  .delete(categoriesService.delete);

export default categoriesRouter;
