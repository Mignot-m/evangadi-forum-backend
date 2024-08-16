import React from "react";
import classes from "./AboutPage.module.css";

const AboutPage = () => {
  return (
    <section className={classes.about_container}>
      <h1>About</h1>
      <h2>Evangadi Networks</h2>
      <p>
        No matter what stage of life you are in, whether you're just starting
        elementary school or being promoted to CEO of a Fortune 500 company, you
        have much to offer to those who are trying to follow in your footsteps.
      </p>
      <p>
        Whether you are willing to share your knowledge or you are just looking
        to meet mentors of your own, please start by joining the network here.
      </p>
      <button>HOW IT WORKS</button>
    </section>
  );
};

export default AboutPage;
