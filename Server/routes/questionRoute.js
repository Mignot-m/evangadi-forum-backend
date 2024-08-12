const express = require("express");
const router = express.Router();
const {
  allQuestions,
  singleQuestion,
  postQuestion,
  validate,
} = require("../Controller/questionController");

// Route to get all questions
router.get("/questions", allQuestions);

// Route to get a single question
router.get("/questions/:question_id", singleQuestion);

// Route to post a new question
router.post("/questions", validate, postQuestion);

module.exports = router;
