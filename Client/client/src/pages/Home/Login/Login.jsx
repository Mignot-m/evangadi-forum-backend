import React, { useContext, useState, useRef } from "react";
import axios from "../../../axiosConfig";

import { Link, useNavigate } from "react-router-dom";
import classes from "./Login.module.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import About from "../../About/AboutPage";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import { AppState } from "../../../App";



function Login() {
  const [errors, setErrors] = useState({});
  // Access login function from context
  const { login, appErrors } = useContext(AppState); // Access login function from context

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Initializes the navigate function
  const navigate = useNavigate();
  //Creates a reference to the email and Password input field and allowing you to access its value directly.
  const userEmail = useRef();
  const userPassword = useRef();

  //handle form submission.
  async function handleSubmit(e) {
    e.preventDefault();
    // Clear previous errors
    setErrors({});
    //Retrieves the current value of the email & Password input field.
    const userEmailValue = userEmail.current.value;
    const userPasswordValue = userPassword.current.value;
    //Checks if either the email or password fields are empty.
    let hasError = false;
    const newError = {};
    if (!userEmailValue) {
      newError.email = "Please provide all required fields";
      hasError = true;
    }
    if (!userPasswordValue) {
      newError.password = "Please provide all required fields";
      hasError = true;
    }
    if (hasError) {
      setErrors(newError);
      return;
    }

    try {
      //Sends a POST request to the /user/login endpoint with the email and password.
      await login({
        email: userEmailValue,
        password: userPasswordValue,
      });

      //Redirects the user to the home page after a successful login
      navigate("/home");

      //to handle any errors that occur during the HTTP request.
    } catch (error) {
      console.log("Error caught:", error.response.data.message);
    }
    // Display the error message
    setErrors(appErrors);
    console.log(errors.appErrors);
  }

  return (
    <>
      <Header />
      <br />
      <section className={classes.loginContainer}>
        <div className="container px-md-5">
          <div className="row">
            <div className="col-12 col-md-5 shadow auth mx-md-4 my-md-5">
              <div className={classes.login_inner}>
                <div className={classes.Carousel_inner}>
                  <div className="carousel-item active">
                    <h3>Login to your account</h3>
                    <div>
                      Don't have an account?
                      <span>
                        <Link to={"/"}> Create a new account</Link>
                      </span>
                    </div>
                    {Object.keys(errors).length > 0 && (
                      <div className={classes.server_error}>
                        {Object.entries(errors)[0] && (
                          <div>{Object.entries(errors)[0][1]}</div> // Display the message of the first error
                        )}
                      </div>
                    )}
                    <form onSubmit={handleSubmit} className={classes.form}>
                      <div
                        className={
                          errors.email
                            ? classes.error_input
                            : classes.from_input
                        }
                      >
                        <input
                          type="email"
                          placeholder="Email"
                          ref={userEmail}
                        />
                        <span className={classes.line}></span>
                      </div>
                      <br />
                      <div
                        className={
                          errors.password
                            ? classes.error_input
                            : classes.from_input
                        }
                      >
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          ref={userPassword}
                        />
                        <span className={classes.line}></span>
                        <span
                          className={
                            errors.password
                              ? classes.password_toggle_error
                              : classes.password_toggle
                          }
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <FiEye /> : <FiEyeOff />}
                        </span>
                      </div>
                      <div className={classes.forget}>
                        <Link to={"/login"}>Forgot password</Link>
                      </div>
                      <div className={classes.btn}>
                        <button type="submit">Login</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <About />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
export default Login;
