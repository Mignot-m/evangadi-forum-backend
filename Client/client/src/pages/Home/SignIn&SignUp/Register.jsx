//to make HTTP requests with the base URL from axiosConfig.js
import axios from "../../../axiosConfig";
//to create components.
import React, { useState,useRef } from "react";

//Imports Link for navigation between routes and useNavigate to programmatically navigate to different routes.
import { Link, useNavigate } from "react-router-dom";
import About from "../../About/AboutPage";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import classes from "./Register.module.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

//In summary, this code defines a registration form component that captures user input, validates it, and submits it to a server. If the registration is successful, it redirects the user to the login page.

function SignINSignUP() {
  const [errors, setErrors] = useState({});
   const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // Initializes the navigate function to redirecting users to the login page after successful registration
  const navigate = useNavigate();

  // Creates references for the email, first name, last name, username, and password input fields and to directly access the DOM element's value.
  const userEmail = useRef(null);
  const userFirstName = useRef(null);
  const userLastName = useRef(null);
  const userName = useRef(null);
  const userPassword = useRef(null);

  //to handle form submission.
  async function handleSubmit(e) {
    //Prevents the default form submission behavior to validating input or sending data to a server
    e.preventDefault();
    //Retrieves the current value of the email,FirstName,LastName,userName &Password input field.
    const userEmailValue = userEmail.current.value;
    const userFirstNameValue = userFirstName.current.value;
    const userLastNameValue = userLastName.current.value;
    const userNameValue = userName.current.value;
    const userPasswordValue = userPassword.current.value;
    //Checks if any of the form fields are empty
    let hasError = false;
    const newError = {};
    if (!userEmailValue) {
      newError.email = "Email value is required !";
      hasError = true;
    }
    if (!userFirstNameValue) {
      newError.firstName = "FirstName value is required!";
      hasError = true;
    }
    if (!userLastNameValue) {
      newError.firstName = "LastName value is required!";
      hasError = true;
    }
    if (!userNameValue) {
      newError.username = "Please provide username!";
      hasError = true;
    }
    if (!userPasswordValue) {
      newError.password = "Please provide valid password!";
      hasError = true;
    }
    if (hasError) {
      setErrors(newError);
      return;
    }

    // try to submit data to the server and handle any errors that occur during the request
    try {
      //Sends a POST request to the /user/register endpoint with the form data.
      await axios.post("/user/register", {
        email: userEmailValue,
        first_name: userFirstNameValue,
        last_name: userLastNameValue,
        username: userNameValue,
        password: userPasswordValue,
      });
      //Shows a success message if the registration is successful.
      setSuccessMessage("Registered successfully.please login");
      setErrors({});
      // Wait for 2 seconds before navigating to the home page
      setTimeout(() => {
        navigate("/login");
      }, 2000);

      //to handle errors if the request fails.
    } catch (error) {
      console.log("Error caught:", error);
      const errorMessage = error?.response?.data?.message;

      // Display the error message
      setErrors({ server: errorMessage });
    }
  }

  return (
    <>
      <section className={classes.register_container}>
        <Header />
        <div className="container px-md-5">
          <div className="row">
            <div className="col-12 col-md-5 shadow auth mx-md-4 ">
              <div className={classes.login_inner}>
                <div className={classes.Carousel_inner}>
                  <div className="carousel-item active">
                    <h5>Join the network</h5>
                    <div>
                      Already have an account?
                      <span>
                        <Link to={"/login"}>Sign in</Link>
                      </span>
                    </div>
                    {Object.keys(errors).length > 0 && (
                      <div className={classes.server_error}>
                        {Object.entries(errors)[0] && (
                          <div>{Object.entries(errors)[0][1]}</div> // Display the message of the first error
                        )}
                      </div>
                    )}
                    {successMessage && (
                      <div className={classes.success_message}>
                        {successMessage}
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
                          type="Email"
                          placeholder="Email"
                          ref={userEmail}
                        />
                        <span className={classes.line}></span>
                      </div>
                      <br />
                      <div className={classes.fNlN}>
                        <div
                          className={
                            errors.firstName
                              ? classes.error_input
                              : classes.from_input
                          }
                        >
                          <input
                            type="text"
                            placeholder="Firstname"
                            ref={userFirstName}
                          />
                          <span className={classes.line}></span>
                        </div>
                        <br />
                        <div
                          className={
                            errors.lastname
                              ? classes.error_input
                              : classes.from_input
                          }
                        >
                          <input
                            type="text"
                            placeholder="lastname"
                            ref={userLastName}
                          />
                          <span className={classes.line}></span>
                        </div>
                      </div>
                      <br />
                      <div
                        className={
                          errors.username
                            ? classes.error_input
                            : classes.from_input
                        }
                      >
                        <input
                          type="text"
                          placeholder="username"
                          ref={userName}
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
                          placeholder="password"
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
                      <div className={classes.agreement}>
                        <p>
                          <span>
                            I agree to the <Link>Privacy Policy</Link> and
                            <Link> terms and service</Link>
                          </span>
                        </p>
                      </div>
                      <div className={classes.btn}>
                        <button type="submit">Agree and Join</button>
                      </div>
                    </form>
                    <span>
                      <Link to={"/login"}>Already have an account ?</Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 ">
              <About />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default SignINSignUP;
