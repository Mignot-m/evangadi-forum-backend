import React, { useRef, useContext,useState } from "react";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { AppState } from "../../../App";
import axios from "../../../axiosConfig";
import { useNavigate } from "react-router-dom";
import classes from "./AskQuestionPage.module.css";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";

function AskQuestionPage() {
  const { user } = useContext(AppState);
  const userid = user.userid;
  const navigate = useNavigate();
  const titleDom = useRef();
  const detailDom = useRef();
 const [errors, setErrors] = useState({});

  async function handle(e) {
    e.preventDefault();
    const titleValue = titleDom?.current?.value;
    const detailValue = detailDom?.current?.value;

    if (!titleValue || !detailValue) {
      setErrors({ general: "Please provide all required information" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      // if (!userid) {
      //   alert("User ID not found. Please log in.");
      //   return;
      // }
      const response = await axios.post(
        "/questions",
        { userid :userid, title: titleValue, description: detailValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Question asked successfully");
      navigate("/");
    } catch (error) {
      setErrors({ general: "Something went wrong" });
      console.error(error.response ? error.response.data : error.message);
    }
  }

  return (
    <>
      <Header />
      <section className={classes.back}>
        <div>
          <h3 className={classes.step}>Steps To Write A Good Question</h3>
        </div>
        <div className={classes.points}>
          <p>
            <BsArrowRightCircleFill className={classes.icon} />
            Summarize your problems in a one-line title.
          </p>
          <p>
            <BsArrowRightCircleFill className={classes.icon} />
            Describe your problem in more detail
          </p>
          <p>
            <BsArrowRightCircleFill className={classes.icon} />
            Describe what you tried and what you expected to happen.
          </p>
          <p>
            <BsArrowRightCircleFill className={classes.icon} />
            Review your question and post it here.
          </p>
          <div className={classes.question_container}>
            <h3 className={classes.post}>Ask a public question</h3>
            <div className={classes.span}>
              <span>Go to Question page</span>
            </div>
            {errors.general && (
              <div className={classes.error_message}>{errors.general}</div>
            )}
            <form onSubmit={handle}>
              <input
                type="text"
                placeholder="Question title"
                ref={titleDom}
                className={classes.title}
              />
              <br />
              <input
                type="text"
                placeholder="Question detail..."
                ref={detailDom}
                className={classes.detail}
              />
              <div className={classes.buttonContainer}>
                <button className={classes.sub}>Post Your Question</button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default AskQuestionPage;
