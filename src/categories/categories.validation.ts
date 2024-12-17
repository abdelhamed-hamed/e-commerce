import { body, param } from "express-validator";
import categoriesSchema from "./categories.schema";
import validatorMiddleware from "../middlewares/validator.middleware";
class CategoryValidation {
  //    Check If Id Valid OR No
  getOne = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    validatorMiddleware,
  ];

  // Add New Category Validation
  creat = [
    body("name")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required"))
      .isLength({ min: 2, max: 15 })
      .withMessage((val, { req }) => req.__("sm-length"))
      .custom(async (value: String, { req }) => {
        const category = await categoriesSchema.findOne({ name: value });
        if (category) throw new Error(req.__("duplicated"));
        return true;
      }),
    validatorMiddleware,
  ];

  // Update Category Validation
  update = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    body("name")
      .optional()
      .isLength({ min: 2, max: 15 })
      .withMessage((val, { req }) => req.__("sm-length"))
      .custom(async (value: String, { req }) => {
        const category = await categoriesSchema.findOne({ name: value });
        if (category && category.id!.toString() != req.params?.id.toString())
          throw Error(req.__("duplicated"));
        return true;
      }),
    validatorMiddleware,
  ];

  // Delete Category VAlidation
  delete = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    validatorMiddleware,
  ];
}

const categoryValidation = new CategoryValidation();
export default categoryValidation;
