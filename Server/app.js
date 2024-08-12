const express = require("express");
const cors = require("cors");
const app = express();
const port = 5500;

app.use(cors());
app.use(express.json());

// Import database connection
const dbConnection = require("./db/dbConfig");

// Import authentication middleware
const authMiddleware = require("./middleware/authMiddleware");

// Import user routes
const userRoutes = require("./routes/userRoute");
app.use("/api/users", userRoutes);

// Import question routes
const questionRoute = require("./routes/questionRoute");
app.use("/api", authMiddleware, questionRoute);

// Import answer routes
const answerRoute = require("./routes/answerRoute");
app.use("/api", authMiddleware, answerRoute);

async function start() {
  try {
    const result = await dbConnection.execute("SELECT 'test' ");
    await app.listen(port);
    console.log("Database connection established successfully!");
    console.log(`Server listening on https://localhost:${port}`);
  } catch (error) {
    console.log(error.message);
  }
}

start();
