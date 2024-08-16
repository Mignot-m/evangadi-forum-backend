import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "../../../axiosConfig";
import { useParams } from "react-router-dom";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import { useNavigate } from "react-router-dom";
import { AppState } from "../../../App";
import questionerIMG from "../../../assets/225-default-avatar (1).svg";
import classes from "./QuestionAndAnswer.module.css";
function QuestionAndAnswer() {
  //to access user from the AppState context.
  const { user } = useContext(AppState);
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const userid = user.userid;

  const navigate = useNavigate();
  //a reference to the textarea element, allowing direct DOM manipulation.
  const answerDom = useRef();
  // Extracts the question ID from the URL parameters.
  const { id } = useParams();

  const [question, setQuestion] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  useEffect(() => {
    //fetch question and answers data.
    async function fetchData() {
      try {
        //Sends a GET request to fetch the question data based on the id from the URL.
        const responseQuestion = await axios.get(`/questions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Updates the question state with the fetched question data.
        setQuestion(responseQuestion.data.question);
        //Sends a POST request to fetch the answers.
        const responseAnswers = await axios.get(`/answer/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnswers(responseAnswers.data.answers);
      } catch (error) {
        console.error("Error fetching question or answers:", error);
      }
    }
    fetchData();
  }, []);
  //Updates the newAnswer state whenever the value of the textarea changes.
  const handleAnswerChange = (e) => {
    setNewAnswer(e.target.value);
  };

  async function handle(e) {
    e.preventDefault();
    const answerValue = answerDom.current.value;

    if (!answerValue) {
       setErrors({ general: "Please provide answer!" });
      return;
    }

    try {
      const response = await axios.post(
        "/answer",
        { userid, question_id: id, answer: answerValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Answer replied successfully!! Go to home page ");
      setNewAnswer(""); // Clear the input field
      setErrors({}); // Clear any previous errors
      // Wait for 2 seconds before navigating to the home page
      setTimeout(() => {
        navigate("/");
      }, 2000);
      
    } catch (error) {
      setErrors({general: "Something went wrong"});
      console.error(error.response ? error.response.data : error.message);
    }
  }

  return (
    <>
      <Header />
      <section className={classes.question_answers_page}>
        <div className={classes.question_answers_Container}>
          <div className={classes.question}>
            <h2>Question</h2>
            <h5>{question.title}</h5>
            <p>{question.description}</p>
          </div>

          <div className={classes.answers}>
            <hr />
            <p>Answer From The Community</p>
            <hr />
            {answers.length === 0 ? (
              <p>No answers yet.</p>
            ) : (
              answers.map((answer) => (
                <div key={answer.id} className={classes.answer_item}>
                  {errors.general && (
                    <div className={classes.error_message}>
                      {errors.general}
                    </div>
                  )}
                  <div className={classes.answer_container}>
                    <img
                      src={questionerIMG}
                      alt={`${question.username}'s image`}
                      className={classes.questionerImage}
                      style={{ width: "70px", height: "70px" }}
                    />
                    <p className={classes.answer_username}> {user.username}</p>
                  </div>
                  <p className={classes.answer_body}>{answer.answer}</p>
                </div>
              ))
            )}
          </div>

          <div className={classes.answer_form}>
            <h2>Answer The Top Question</h2>
            <p>Go to Question page</p>
            {successMessage && (
              <div className={classes.success_message}>{successMessage}</div>
            )}
            {errors.general && (
              <div className={classes.error_message}>{errors.general}</div>
            )}
            <textarea
              value={newAnswer}
              ref={answerDom}
              onChange={handleAnswerChange}
              placeholder="Your Answer... "
            />

            <button onClick={handle}>Post Your Answer</button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default QuestionAndAnswer;
