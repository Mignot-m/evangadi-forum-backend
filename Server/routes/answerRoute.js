const express = require("express");
const { postAnswer, getAnswer } = require("../Controller/answerController");
const router = express.Router();
//post answer route
router.post("/answer", postAnswer);
//get answer route
router.get("/answer/:question_id", getAnswer);
module.exports = router;
