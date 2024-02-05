const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignUp);

router.post("/signup", authController.postSignUp);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.post("/reset", authController.postReset);

router.post("/new-passsword", authController.postNewPassword);

router.get("/reset", authController.getReset);

router.get("/reset/:token", authController.getNewPassword);

module.exports = router;
