const express = require("express");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();
const { validationResult, body } = require("express-validator");
const dbConnection = require("../db/dbConfig");

// Define validation rules for posting an answer
const validateAnswer = [
  body("userid").isInt().withMessage("User ID must be an integer"),
  body("question_id").isUUID().withMessage("Invalid question ID format"),
  body("answer").isLength({ min: 1 }).withMessage("Answer cannot be empty"),
];

// Function to post a new answer
async function postAnswer(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  const { userid, question_id, answer } = req.body;
  if (!answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Bad Request", message: "Please provide answer" });
  }

  try {
    const newAnswer = await dbConnection.query(
      "INSERT INTO answerTable (userid, question_id, answer) VALUES (?, ?, ?)",
      [userid, question_id, answer]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Answer posted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

// Function to get answers for a specific question
async function getAnswer(req, res) {
  const questionId = req.params.question_id;

  try {
    const answersResult = await dbConnection.query(
      "SELECT answerid, userid, answer FROM answerTable WHERE question_id = ?",
      [questionId]
    );

    const answers = answersResult[0];

    const filteredAnswers = answers.filter((answer) => answer.answerid);

    if (filteredAnswers.length > 0) {
      const formattedAnswers = filteredAnswers.map((answer) => ({
        answerid: answer.answerid,
        userid: answer.userid,
        answer: answer.answer,
      }));

      return res.json({ answers: formattedAnswers });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "The requested question could not be found.",
      });
    }
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

module.exports = { postAnswer, getAnswer };
