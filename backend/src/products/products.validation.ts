import { body, param } from "express-validator";
import validatorMiddleware from "../middlewares/validator.middleware";
import categoriesSchema from "../categories/categories.schema";
import subcategoriesSchema from "../subcategories/subcategories.schema";
import productsSchema from "./products.schema";

class ProductsValidation {
  getOne = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    validatorMiddleware,
  ];

  creat = [
    body("name")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required"))
      .isLength({ min: 2, max: 50 })
      .withMessage((val, { req }) => req.__("sm-length")),
    body("description")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required"))
      .isLength({ min: 10, max: 300 })
      .withMessage((val, { req }) => req.__("lg-length")),
    body("price")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required"))
      .custom((val: number, { req }) => {
        if (Number.isNaN(Number(val)) || val <= 0) throw Error(req.__("price"));
        return true;
      }),
    body("quantity")
      .optional()
      .isInt({ min: 1, max: 10000 })
      .withMessage((val, { req }) => req.__("invalid"))
      .custom((val: number, { req }) => {
        if (Number.isNaN(Number(val)) || val <= 0)
          throw Error(req.__("quantity"));
        return true;
      }),
    body("discount")
      .optional()
      .isFloat({ min: 1, max: 100 })
      .withMessage((val, { req }) => req.__("invalid"))
      .custom((val, { req }) => {
        if (!Number.isNaN(Number(val)) || val > 0) {
          req.body.priceAfterDiscount =
            req.body.price - (req.body.price * val) / 100;
        } else throw Error(req.__("discount"));
        return true;
      }),
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
    body("subcategory")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required"))
      .isMongoId()
      .withMessage((val, { req }) => req.__("id"))
      .custom(async (value: string, { req }) => {
        const subcategory = await subcategoriesSchema.findById(value);
        if (!subcategory) throw Error(req.__("not-found"));
        // نفس فكرة الجزء ال تجت
        else {
          if (subcategory?.category._id != req.body.category)
            throw Error(req.__("update-product-subcategory-error"));
        }
        return true;
      }),
    validatorMiddleware,
  ];

  update = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    body("name")
      .optional()
      .isLength({ min: 2, max: 15 })
      .withMessage((val, { req }) => req.__("sm-length")),
    body("description")
      .optional()
      .isLength({ min: 10, max: 300 })
      .withMessage((val, { req }) => req.__("lg-length")),
    body("price")
      .optional()
      .custom((val: number, { req }) => {
        if (Number.isNaN(Number(val)) || val <= 0) throw Error(req.__("price"));
        return true;
      }),
    body("quantity")
      .optional()
      .isInt({ min: 1, max: 10000 })
      .withMessage((val, { req }) => req.__("invalid"))
      .custom((val: number, { req }) => {
        if (Number.isNaN(Number(val)) || val <= 0)
          throw Error(req.__("quantity"));
        return true;
      }),
    body("discount")
      .optional()
      .isFloat({ min: 1, max: 100 })
      .withMessage((val, { req }) => req.__("invalid"))
      .custom((val, { req }) => {
        if (!Number.isNaN(Number(val)) || val > 0) {
          req.body.priceAfterDiscount =
            req.body.price - (req.body.price * val) / 100;
        } else throw Error(req.__("discount"));
        return true;
      }),
    body("category")
      .optional()
      .isMongoId()
      .withMessage((val, { req }) => req.__("id"))
      .custom(async (val: string, { req }) => {
        const category = await categoriesSchema.findById(val);
        if (!category) throw Error(req.__("not-found"));
        // الجزء دا فايدته لو لقي كاتيجوري بيشوف هل ال كاتوجيري ال اليوزر دخله هو نفس ال موجود في الصب كاتيجوري للعنصر ولا لا
        // لو اه تمام لو لا يرجع انهم مش متطابقين عشان دي سكيورتي
        else {
          const product = await productsSchema.findById(req.params!.id);
          // انا بحثت عن المنتج شوفته موجود ولا لا بعدها شوفت هل ال اي دي لل كاتييجري الجديده ال في ال بادي هو هو نفس ال اي دي في الصب كاتيجوري للكاتجري ال فيها لو اه تمام
          // لو لا يرجع ايرور
          if (product?.subcategory.category._id != req.body.category)
            throw Error(req.__("update-product-subcategory-error"));
        }
        return true;
      }),
    body("subcategory")
      .optional()
      .isMongoId()
      .withMessage((val, { req }) => req.__("id"))
      .custom(async (value: string, { req }) => {
        const subcategory = await subcategoriesSchema.findById(value);
        if (!subcategory) throw Error(req.__("not-found"));
        // الجزء دا فايدته لو لقي صب كاتيجوري بيشوف هل ال صب كاتوجيري ال اليوزر دخله هو نفس ال موجود في  كاتيجوري  الاصلي للعنصر ولا لا
        // لو اه تمام لو لا يرجع انهم مش متطابقين عشان دي سكيورتي
        else {
          const product = await productsSchema.findById(req.params!.id);
          // انا بحثت عن المنتج شوفته موجود ولا لا بعدها شوفت هل اسم الكتيجوري هو هو نفس اسمها في الصب كاتيجوري ال دخلتها جديد لو اه تمام
          // لو لا يرجع ايرور
          if (subcategory.category.name != product?.category.name)
            throw Error(req.__("update-product-subcategory-error"));
        }
        return true;
      }),
    validatorMiddleware,
  ];

  delete = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    validatorMiddleware,
  ];
}

const productsValidation = new ProductsValidation();
export default productsValidation;
