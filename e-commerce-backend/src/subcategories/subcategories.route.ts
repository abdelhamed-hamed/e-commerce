import { Router } from "express";
import subCategoriesService from "./subcategories.service";
import subcategoriesService from "./subcategories.service";

const subcategoriesRouter: Router = Router({ mergeParams: true });

subcategoriesRouter
  .route("/")
  .get(subcategoriesService.filterSubcategories, subCategoriesService.getAll)
  .post(subcategoriesService.setCategoryId, subCategoriesService.create);

subcategoriesRouter
  .route("/:id")
  .get(subCategoriesService.getOne)
  .put(subCategoriesService.update)
  .delete(subCategoriesService.delete);

export default subcategoriesRouter;
