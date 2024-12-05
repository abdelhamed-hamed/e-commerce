import express from "express";
import subcategoriesRouter from "./subcategories/subcategories.route";
import categoriesRouter from "./categories/categories.route";

// Edit Express Request
declare module "express" {
  interface Request {
    filterData?: any;
  }
}
const mainRoutes = (app: express.Application) => {
  app.use("/api/v1/categories", categoriesRouter);
  app.use("/api/v1/subcategories", subcategoriesRouter);
};

export default mainRoutes;
