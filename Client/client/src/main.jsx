//imports the React library for creating React components
import React from "react";
//imports ReactDOM library for rendering React components into the DOM.
import ReactDOM from "react-dom/client";
import App from "./App";
//imports the BrowserRouter to define different routes and navigate between them.
import { BrowserRouter } from "react-router-dom";

//gets the HTML element with the ID root and creates a React root on that element
const root = ReactDOM.createRoot(document.getElementById("root"));
//renders the React component tree into the DOM element referenced by root.
root.render(
  //Wraps the component tree in React.StrictMode to identifying potential problems in the application.
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
