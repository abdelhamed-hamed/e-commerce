import { Router } from "express";
import ProductsService from "./products.service";
import productsValidation from "./products.validation";
import multer from "multer";
import productsService from "./products.service";
import { uploadMultiFiles } from "../middlewares/uploadsFiles.middleware";
import authService from "../auth/auth.service";
const productsRouter: Router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});
productsRouter
  .route("/")
  .get(ProductsService.getAll)
  .post(
    authService.protectedRoute,
    authService.checkActive,
    authService.allowedTo("admin", "employee"),
    uploadMultiFiles(
      ["image"],
      [
        { name: "cover", maxCount: 1 },
        { name: "images", maxCount: 5 },
      ]
    ),
    productsService.saveImage,
    productsValidation.creat,
    ProductsService.create
  );

productsRouter
  .route("/:id")
  .get(productsValidation.getOne, ProductsService.getOne)
  .put(
    authService.protectedRoute,
    authService.checkActive,
    authService.allowedTo("admin", "employee"),
    uploadMultiFiles(
      ["image"],
      [
        { name: "cover", maxCount: 1 },
        { name: "images", maxCount: 5 },
      ]
    ),
    productsService.saveImage,
    productsValidation.update,
    ProductsService.update
  )
  .delete(
    authService.protectedRoute,
    authService.checkActive,
    authService.allowedTo("admin", "employee"),
    productsValidation.delete,
    ProductsService.delete
  );

export default productsRouter;
