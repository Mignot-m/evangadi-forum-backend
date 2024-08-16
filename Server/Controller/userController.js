const dbConnection = require("../db/dbConfig");
// module to encrypt password
const bcrypt = require("bcrypt");
// module to check the status code
const { StatusCodes } = require("http-status-codes");
// JWT module for login authentication
const jwt = require("jsonwebtoken");
// signup function
async function register(req, res) {
  const { username, first_name, last_name, email, password } = req.body;

  if (!username || !first_name || !last_name || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide all required fields" });
  }

  try {
    const [user] = await dbConnection.query(
      "SELECT username,userid from userTable where username=? or email=?",
      [username, email]
    );
    if (user.length > 0) {
      return res
        .status(StatusCodes.CONFLICT)

        .json({ error: "Conflict", message: "User already existed" });
    }

    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Password must be at least 8 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const [result] = await dbConnection.query(
      "INSERT INTO userTable(username, first_name, last_name, email, password) VALUES(?, ?, ?, ?, ?)",
      [username, first_name, last_name, email, hashedPassword]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "User created successfully!" });
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}
//login function
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }
  try {
    const [user] = await dbConnection.query(
      "SELECT username,userid,password from userTable where  email=? ",
      [email]
    );
    if (user.length == 0) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Unauthorized",
        message: "Invalid username or password",
      });
    }
    // compare hashed password with provided password

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid credential" });
    }
    const username = user[0].username;
    const userid = user[0].userid;
    // Creates a JSON Web Token with the user's username and ID, which expires in 1 day.
    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: "User login successful", token, username, userid });
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

// check user function
async function checkUser(req, res) {
  // Retrieves and responds with the username and user ID from the request object.
  try {
    const { username, userid } = req.user;
    if (!username || !userid) {
      // Handle cases where req.user might not have the required properties
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Unauthorized", message: "User information missing" });
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: "Valid user", username, userid });
  } catch (error) {
    console.log("Error in checkUser:", error.message);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized", message: "Authentication invalid" });
  }
}

module.exports = { register,login,checkUser};
