import express from "express";
import subcategoriesRouter from "./subcategories/subcategories.route";
import categoriesRouter from "./categories/categories.route";

import ApiErrors from "./utils/api-errors";
import globalErrors from "./middlewares/errors.middlewares";
import productsRoute from "./products/products.route";
import usersRoute from "./users/users.route";
import authRoute from "./auth/auth.route";
import { Users } from "./users/users.interface";
import profileRoute from "./profile/profile.route";

// Edit Express Request
declare module "express" {
  interface Request {
    filterData?: any;
    files?: any;
    user?: Users;
  }
}

const mainRoutes = (app: express.Application) => {
  app.use("/api/v1/categories", categoriesRouter);
  app.use("/api/v1/subcategories", subcategoriesRouter);
  app.use("/api/v1/products", productsRoute);
  app.use("/api/v1/users", usersRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/profile", profileRoute);

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
