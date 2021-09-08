// Component that renders a login form

import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export const Login = (props) => {
  // Use history to be able to link to other Routes.
  const history = useHistory();
  const [isError, setIsError] = useState(false);

  // Declare states purely to control the form elements.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Single handler for all controlled form elements, updates the corresponding
  // state depending on which field was typed in.
  const handleChange = (event) => {
    const currentValue = event.target.value;
    if (event.target.name === "email") {
      setEmail(currentValue);
    } else if (event.target.name === "password") {
      setPassword(currentValue);
    }
  };

  // Handler for when the final form is submitted.
  const handleSubmit = async (event) => {
    setIsError(false);
    // Prevent the browser from re-loading the page
    event.preventDefault();

    // Call the server with the different states as arguments.
    const url = "/authentication/login";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
      });
      const jsonResponse = await response.json();

      if (jsonResponse.error) {
        console.log(jsonResponse.error);
        setIsError(jsonResponse.message);
      } else if (jsonResponse.token) {
        //store jwt and user info in sessionStrorage
        sessionStorage.setItem("token", jsonResponse.token);
        // Reset the states back to empty, so that the form looks blank again.
        setEmail("");
        setPassword("");

        // Redirect the user to the next page.
        history.push("/");
      } else {
        setIsError("Your login and/or password didn't match");
      }
    } catch (error) {
      console.log(error);
      setIsError(error);
    }
  };

  return (
    <div className="login-form">
      {isError ? (
        <div>
          Sorry! There was an eror performing this action:<br></br>
          {isError} <br></br>
          <button onClick={() => setIsError(false)}>Try again</button>
        </div>
      ) : (
        <div>
          <h2>Log in</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email:</label>
            <br></br>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            ></input>
            <br></br>
            <label htmlFor="password">Password:</label>
            <br></br>
            <input
              type="text"
              name="password"
              id="password"
              value={password}
              onChange={handleChange}
              requried
            ></input>
            <br></br>
            <input type="submit" value="Login"></input>
          </form>
          <p>Not a user yet? Register here:</p>
          <button onClick={() => history.push("/register")}>Register</button>
        </div>
      )}
    </div>
  );
};
