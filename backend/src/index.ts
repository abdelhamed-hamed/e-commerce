import express from "express";
import subcategoriesRouter from "./subcategories/subcategories.route";
import categoriesRouter from "./categories/categories.route";
import { Error } from "mongoose";
import ApiErrors from "./utils/api-errors";
import globalErrors from "./middlewares/errors.middlewares";
import productsRoute from "./products/products.route";

// Edit Express Request
declare module "express" {
  interface Request {
    filterData?: any;
  }
}

const mainRoutes = (app: express.Application) => {
  app.use("/api/v1/categories", categoriesRouter);
  app.use("/api/v1/subcategories", subcategoriesRouter);
  app.use("/api/v1/products", productsRoute);

  //  Handle Routes Error
  app.all(
    "*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      next(new ApiErrors(`route ${req.originalUrl} not-found`, 400));
    }
  );

  // Show Error in json
  app.use(globalErrors);
};

export default mainRoutes;
