//from our project we have to create questionroute ,answerroute and so on files
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
// import user controllers
const { register, login, checkUser } = require("../Controller/userController");

// register route
router.post("/register", register);
// login rout
router.post("/login", login);
// check user
router.get("/checkUser", authMiddleware, checkUser);


module.exports = router;
