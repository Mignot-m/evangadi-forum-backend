const { StatusCodes } = require("http-status-codes");
const { validationResult, body } = require("express-validator");
const dbConnection = require("../db/dbConfig");
const { v4: uuidv4 } = require("uuid");

// Define validation rules using express-validator
const validate = [
  body("title")
    .isLength({ min: 1, max: 50 })
    .withMessage("Title must be between 1 and 50 characters"),
  body("description")
    .isLength({ min: 1 })
    .withMessage("Description cannot be empty"),
  body("tag").isLength({ min: 1 }).withMessage("Tag cannot be empty"),
];

// Function to post questions
async function postQuestion(req, res) {
  // Extracts data sent with the HTTP request
  const { title, description, userid } = req.body;
  // Checks if all required fields are present in the request body
  if (!title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    const question_id = uuidv4(); // Generate a unique identifier for the question

    await dbConnection.query(
      "INSERT INTO questionTable (userid, title, description, question_id) VALUES (?, ?, ?, ?)",
      [userid, title, description, question_id]
    );

    return res.status(StatusCodes.CREATED).json({
      message: "Question created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

async function allQuestions(req, res) {
  try {
    // Query the database to get all questions with user information
   const [questions] =
     await dbConnection.query(`SELECT q.question_id, q.title, q.description, u.username
      FROM questionTable q
      JOIN userTable u ON q.userid = u.userid`);
   console.log(questions);

    // Check if there are no questions found
    if (questions.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "No questions found",
      });
    }

    // Respond with the list of questions
    return res.status(StatusCodes.OK).json({
      message: "Questions retrieved successfully",
      questions,
    });
  } catch (error) {
    // Log the error and respond with a server error message
    console.error("Error retrieving questions:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

async function singleQuestion(req, res) {
  const questionId = req.params.question_id; // Keep question_id as a string

  const query = `SELECT 
  q.question_id, 
  q.title, 
  q.description, 
  u.username
FROM 
  questionTable q
JOIN 
  userTable u
ON 
  q.userid = u.userid
WHERE 
  q.question_id = ?;
`;

  try {
    const [results] = await dbConnection.query(query, [questionId]);

    if (results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "The requested question could not be found.",
      });
    }

    const question = results[0];
    res.status(StatusCodes.OK).json({ question });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

module.exports = { allQuestions, singleQuestion, postQuestion, validate };
