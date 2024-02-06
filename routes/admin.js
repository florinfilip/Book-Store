const path = require("path");

const express = require("express");

const { check, body } = require("express-validator");

const isAuth = require("../middleware/is-auth");

const adminController = require("../controllers/admin");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  [
    body("title").isString().isLength({ min: 3 }),
    body("imageUrl").isURL(),
    body("price").isLength({ min: 3 }),
    body("description").isLength({ min: 5 }),
  ],
  adminController.postAddProduct
);

router.get("/edit-product/:productId", adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    body("title", "Invalid Title").isAlphanumeric().isLength({ min: 3 }).trim(),
    body("imageUrl", "Invalid image url").isURL(),
    body("price", "Invalid Price").isLength({ min: 3 }).trim(),
    body("description", "Invalid Description").isLength({ min: 5 }).trim(),
  ],
  adminController.postEditProduct
);

router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
