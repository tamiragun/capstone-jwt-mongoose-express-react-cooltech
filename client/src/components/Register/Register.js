// Component that renders a registration form

import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export const Register = (props) => {
  // Use history to be able to link to other Routes.
  const history = useHistory();

  // Error toggle to capture any API call failures and display a user-friendly
  // error message.
  const [isError, setIsError] = useState(false);

  // Declare states purely to control the form elements.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [org_unit, setOrg_unit] = useState();
  const [division, setDivision] = useState("");

  // Single handler for all controlled form elements, updates the corresponding
  // state depending on which field was typed in.
  const handleChange = (event) => {
    const currentValue = event.target.value;
    if (event.target.name === "name") {
      setName(currentValue);
    } else if (event.target.name === "email") {
      setEmail(currentValue);
    } else if (event.target.name === "password") {
      setPassword(currentValue);
    } else if (event.target.name === "org_unit") {
      setOrg_unit(currentValue);
    } else if (event.target.name === "division") {
      setDivision(currentValue);
    }
  };

  // Handler for when the final form is submitted.
  const handleSubmit = async (event) => {
    setIsError(false);
    // Prevent the browser from re-loading the page
    event.preventDefault();

    // Call the server with the different state hooks in the body.
    const url = "/authentication/register";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          affiliation: { org_unit: org_unit, division: division },
        }),
      });
      const jsonResponse = await response.json();

      // If there has been an error, set the error state hook to the arror
      // message, which will then be displayed on the page.
      if (jsonResponse.error) {
        console.log(jsonResponse.error);
        setIsError(jsonResponse.message);

        // If instead the token was set successfully, store that in session storage
        // do that the token can be checked throughout the user's session across the app
      } else if (jsonResponse.token) {
        sessionStorage.setItem("token", jsonResponse.token);

        // Reset the states back to empty, so that the form looks blank again.
        setName("");
        setEmail("");
        setPassword("");
        setOrg_unit(null);
        setDivision("");

        // Redirect the user to the next page.
        history.push("/");
      } else {
        setIsError(
          "There was an error with your registration. Please contact an admin for support."
        );
      }
    } catch (error) {
      console.log(error);
      setIsError(error);
    }
  };

  return (
    <div className="register-form">
      {/*If there was any kind of error, display only the error message with nav buttons */}
      {isError ? (
        <div>
          Sorry! There was an eror performing this action:<br></br>
          {isError} <br></br>
          <button onClick={() => setIsError(false)}>Try again</button>
        </div>
      ) : (
        // Otherwise, display the registration form
        <div>
          <h2>Register</h2>
          <div className="form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-fields">
                <label htmlFor="name">Name:</label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  required
                ></input>

                <label htmlFor="email">Email:</label>

                <input
                  type="text"
                  name="email"
                  id="email"
                  value={email}
                  onChange={handleChange}
                  required
                ></input>

                <label htmlFor="password">Password:</label>

                <input
                  type="text"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                ></input>

                <label htmlFor="org_unit">Organisational unit:</label>

                <select
                  id="org_unit"
                  name="org_unit"
                  onChange={handleChange}
                  required
                >
                  <option value="">Please select</option>
                  <option value="News management">News management</option>
                  <option value="Software reviews">Software reviews</option>
                  <option value="Hardware reviews">Hardware reviews</option>
                  <option value="Opinion publishing">Opinion publishing</option>
                </select>

                <label htmlFor="division">Division:</label>

                <input
                  type="text"
                  id="division"
                  name="division"
                  value={division}
                  onChange={handleChange}
                  required
                ></input>
                <div></div>
                <input
                  className="button"
                  type="submit"
                  value="Register"
                ></input>
              </div>
            </form>
          </div>
          {/*Allow the user to switch to the login page instead */}
          <p>Already a user? Log in here:</p>
          <button
            className="button nav-button"
            onClick={() => history.push("/login")}
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};
