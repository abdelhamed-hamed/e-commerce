import { Router } from "express";
import categoriesService from "./categories.service";
import subcategoriesRouter from "../subcategories/subcategories.route";
import categoryValidation from "./categories.validation";
import { uploadSingleFile } from "../middlewares/uploadsFiles.middleware";

const categoriesRouter: Router = Router();

// Get Subcategories by Category
categoriesRouter.use("/:categoryId/subcategories", subcategoriesRouter);

categoriesRouter
  .route("/")
  .get(categoriesService.getAll)
  .post(
    uploadSingleFile(["image"], "image"),
    categoriesService.saveImage,
    categoryValidation.creat,
    categoriesService.create
  );

categoriesRouter
  .route("/:id")
  .get(categoryValidation.getOne, categoriesService.getOne)
  .put(
    uploadSingleFile(["image"], "image"),
    categoriesService.saveImage,
    categoryValidation.update,
    categoriesService.update
  )
  .delete(categoryValidation.delete, categoriesService.delete);

export default categoriesRouter;
