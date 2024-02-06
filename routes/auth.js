const express = require("express");

const { check, body } = require("express-validator");

const authController = require("../controllers/auth");

const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignUp);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => { 
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-mail exists already, please pick a different one"
            );
          }
        });
      }),
    body(
      "password",
      "The password should have only letters and numbers and exceed 5 characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("The passwords do not match");
      }
      return true;
    }),
  ],
  authController.postSignUp
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please input a valid email"),
    body("password", "Password has to be valid.").isAlphanumeric(),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.post("/reset", authController.postReset);

router.post("/new-passsword", authController.postNewPassword);

router.get("/reset", authController.getReset);

router.get("/reset/:token", authController.getNewPassword);

module.exports = router;
