import React, { useEffect, useState, useContext } from "react";
//imports the useContext hook from React to access the context values
//Imports the AppState context created in the App component
import { AppState } from "../../App";
import axios from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import questionerIMG from "../../assets/225-default-avatar (1).svg";
import { IoIosArrowForward } from "react-icons/io";
import classes from "./Home.module.css";
import Header from "../Header/Header";
//The Home component displays a welcome message to the user using the username value from the user object.It uses the useContext hook to access the user object from the AppState context. This object contains information about the logged-in user, such as their username.

function Home() {
  //provides the user object from the global state, which contains information about the logged-in user.
  const { user } = useContext(AppState);
  const [questions, setQuestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQuestions() {
      const token = localStorage.getItem("token"); // Get token from local storage
      try {
        const { data } = await axios.get("/questions", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        });
        // Ensure data is an array before setting state
        if (Array.isArray(data.questions)) {
          setQuestions(data.questions);
        } else {
          console.error("Expected an array but got:", data);
        }
      } catch (error) {
        console.error(
          "Error fetching questions:",
          error.response?.data || error.message
        );
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        }
       setErrorMessage("Failed to load questions. Please try again later.");
      }
    }
    fetchQuestions();
  }, []);

  const handleQuestionClick = (questionId) => {
    navigate(`/questions/${questionId}`);
  };
  // <h1>Questions</h1>;
  return (
    <>
      <Header />
      <section className={classes.questionsPage}>
        <div className={classes.welcomeMessage}>
          <button
            className={classes.askQuestionButton}
            onClick={() => navigate("/questions")}
          >
            Ask Question
          </button>
          <h1>
            Welcome:<span>{user.username || "Loading..."}</span>
          </h1>
        </div>
        {errorMessage && (
          <div className={classes.errorMessage}>{errorMessage}</div>
        )}
        <div className={classes.questionsList}>
          <h2>Questions</h2>
          {Array.isArray(questions) && questions.length === 0 ? (
            <p>No questions available.</p>
          ) : (
            Array.isArray(questions) &&
            questions
              .slice() // Create a shallow copy to avoid mutating the original array
              .reverse() // Reverse the order of the array
              .map((question) => (
                <div
                  key={question.question_id}
                  className={classes.questionItem}
                  onClick={() => handleQuestionClick(question.question_id)}
                >
                  <div className={classes.questionerInfo}>
                    <div>
                      <img
                        src={questionerIMG}
                        alt={`${question.username}'s image`}
                        className={classes.questionerImage}
                        style={{ width: "80px", height: "80px" }}
                      />
                      <h5 className={classes.username}>{question.username}</h5>
                    </div>
                    <h3>{question.title}</h3>
                    <IoIosArrowForward className={classes.icon} />
                  </div>
                </div>
              ))
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
