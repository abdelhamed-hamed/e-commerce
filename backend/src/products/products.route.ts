import { Router } from "express";
import ProductsService from "./products.service";
import productsValidation from "./products.validation";
import multer from "multer";
import productsService from "./products.service";
import { uploadSingleFile } from "../middlewares/uploadsFiles.middleware";
const productsRouter: Router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});
productsRouter
  .route("/")
  .get(ProductsService.getAll)
  .post(
    uploadSingleFile(["image"], "cover"),
    productsService.saveImage,
    productsValidation.creat,
    ProductsService.create
  );

productsRouter
  .route("/:id")
  .get(productsValidation.getOne, ProductsService.getOne)
  .put(
    uploadSingleFile(["image"], "cover"),
    productsService.saveImage,
    productsValidation.update,
    ProductsService.update
  )
  .delete(productsValidation.delete, ProductsService.delete);

export default productsRouter;
