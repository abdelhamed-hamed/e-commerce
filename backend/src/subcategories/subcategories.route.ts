import { Router } from "express";
import subCategoriesService from "./subcategories.service";
import subcategoriesService from "./subcategories.service";
import subcategoriesValidation from "./subcategories.validation";
import { uploadSingleFile } from "../middlewares/uploadsFiles.middleware";

const subcategoriesRouter: Router = Router({ mergeParams: true });

subcategoriesRouter
  .route("/")
  .get(subcategoriesService.filterSubcategories, subCategoriesService.getAll)
  .post(
    uploadSingleFile(["image"], "image"),
    subCategoriesService.saveImage,
    subcategoriesValidation.creat,
    subcategoriesService.setCategoryId,
    subCategoriesService.create
  );

subcategoriesRouter
  .route("/:id")
  .get(subcategoriesValidation.getOne, subCategoriesService.getOne)
  .put(
    uploadSingleFile(["image"], "image"),
    subCategoriesService.saveImage,
    subcategoriesValidation.update,
    subCategoriesService.update
  )
  .delete(subcategoriesValidation.delete, subCategoriesService.delete);

export default subcategoriesRouter;
