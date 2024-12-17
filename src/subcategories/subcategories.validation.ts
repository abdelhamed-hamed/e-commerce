import { body, param } from "express-validator";
import validatorMiddleware from "../middlewares/validator.middleware";
import categoriesSchema from "../categories/categories.schema";
class SubcategoriesValidation {
  //    Check If Id Valid OR No
  getOne = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    validatorMiddleware,
  ];

  // Add New Subcategory Validation
  creat = [
    body("name")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required"))
      .isLength({ min: 2, max: 50 })
      .withMessage((val, { req }) => req.__("sm-length")),
    body("category")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required"))
      .isMongoId()
      .withMessage((val, { req }) => req.__("id"))
      .custom(async (value: string, { req }) => {
        const category = await categoriesSchema.findById(value);
        if (!category) throw Error(req.__("not-found"));
        return true;
      }),
    validatorMiddleware,
  ];

  // Update Subcategory Validation
  update = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    body("name")
      .optional()
      .isLength({ min: 2, max: 15 })
      .withMessage((val, { req }) => req.__("sm-length")),
    body("category")
      .optional()
      .isMongoId()
      .withMessage((val, { req }) => req.__("id"))
      .custom(async (val: string, { req }) => {
        const category = await categoriesSchema.findById(val);
        if (!category) throw Error(req.__("not-found"));
        return true;
      }),
    validatorMiddleware,
  ];

  // Delete Subcategory VAlidation
  delete = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    validatorMiddleware,
  ];
}

const subcategoriesValidation = new SubcategoriesValidation();
export default subcategoriesValidation;
