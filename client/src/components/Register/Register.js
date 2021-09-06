// Component that renders a registration form

import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export const Register = (props) => {
  // Use history to be able to link to other Routes.
  const history = useHistory();

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
    // Prevent the browser from re-loading the page
    event.preventDefault();

    // Call the server with the different states as arguments.
    const url = "/authentication/register";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        org_unit: org_unit,
        division: division,
      }),
    });
    const jsonResponse = await response.json();

    if (jsonResponse.err) {
      //Display an alert to the user?
      console.log(jsonResponse.err);
    }
    if (jsonResponse.token) {
      //store jwt and user info in sessionStrorage
      sessionStorage.setItem("token", jsonResponse.token);
      console.log(sessionStorage.getItem("token"));
      // Reset the states back to empty, so that the form looks blank again.
      setName("");
      setEmail("");
      setPassword("");
      setOrg_unit(null);
      setDivision("");

      // Redirect the user to the next page.
      //ADAPT THIS
      history.push("/");
    }
  };

  return (
    <div className="register-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <br></br>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={handleChange}
          required
        ></input>
        <br></br>

        <label htmlFor="email">Email:</label>
        <br></br>
        <input
          type="text"
          name="email"
          id="email"
          value={email}
          onChange={handleChange}
          required
        ></input>
        <br></br>

        <label htmlFor="password">Password:</label>
        <br></br>
        <input
          type="text"
          id="password"
          name="password"
          value={password}
          onChange={handleChange}
          required
        ></input>
        <br></br>

        <label htmlFor="org_unit">Organisational unit:</label>
        <br></br>
        <select id="org_unit" name="org_unit" onChange={handleChange} required>
          <option value="">Please select</option>
          <option value="News management">News management</option>
          <option value="Software reviews">Software reviews</option>
          <option value="Hardware reviews">Hardware reviews</option>
          <option value="Opinion publishing">Opinion publishing</option>
        </select>
        <br></br>

        <label htmlFor="division">Division:</label>
        <br></br>
        <input
          type="text"
          id="division"
          name="division"
          value={division}
          onChange={handleChange}
          required
        ></input>
        <br></br>
        <br></br>

        <input type="submit" value="Register"></input>
      </form>
      <p>Already a user? Log in here:</p>
      <button onClick={() => history.push("/login")}>Login</button>
    </div>
  );
};
