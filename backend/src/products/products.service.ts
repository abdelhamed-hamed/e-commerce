import { Request, Response, NextFunction } from "express";
import sharp from "sharp";

import crudService from "../shared/crud.service";
import { Products } from "./products.interface";
import productsSchema from "./products.schema";

// Service for Products CRUD operations
class ProductsService {
  // Get all Products from the database
  getAll = crudService.getAll<Products>(productsSchema, "products");
  // Get One Product
  getOne = crudService.getOne<Products>(productsSchema);

  // Create a new Product
  create = crudService.create<Products>(productsSchema);

  // update one Product
  update = crudService.update<Products>(productsSchema);

  // Delete one Product
  delete = crudService.delete<Products>(productsSchema);
  // Save Images
  saveImage = async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      const file = req.file;
      const fileName = `cover-${Date.now()}-${file.originalname.split(".")[0]}`;
      sharp(file.buffer)
        .webp({ quality: 90 })
        .resize({ width: 500, height: 500 })
        .toFile(`src/uploads/images/products/${fileName}.webp`);
      req.body.cover = fileName;
    }
    next();
  };
}

// Takeing Copy from the categoryService
const productsService = new ProductsService();

// Exporting the ProductsService copied from the categoryService Class
export default productsService;
