// Component that renders a single user, with options to edit fields

import React, { useState, useEffect } from "react";
import "./CredentialForm.css";

export const CredentialForm = (props) => {
  // Declare states purely to control the form elements.
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [org_unit, setOrg_unit] = useState();
  const [division, setDivision] = useState("");

  // Single handler for all controlled form elements, updates the corresponding
  // state depending on which field was typed in.
  const handleChange = (event) => {
    const currentValue = event.target.value;
    if (event.target.name === "name") {
      setName(currentValue);
    } else if (event.target.name === "login") {
      setLogin(currentValue);
    } else if (event.target.name === "password") {
      setPassword(currentValue);
    } else if (event.target.name === "org_unit") {
      setOrg_unit(currentValue);
    } else if (event.target.name === "division") {
      setDivision(currentValue);
    }
  };

  // Handler for when the final form is submitted.
  const handleSubmit = (event) => {
    // Prevent the browser from re-loading the page
    event.preventDefault();

    // Call the prop formHandler with the different states as arguments. The prop
    // references a different function depending on whether the form type is
    // to edit an existing job or to add a new job.
    props.formHandler(name, login, password, org_unit, division);
  };

  useEffect(() => {
    // Set the values in the fields as the current values of the credential
    // or they will be blank in the case of a new credential.
    setName(props.name);
    setLogin(props.login);
    setPassword(props.password);
    setOrg_unit(props.org_unit);
    setDivision(props.division);

    // To set the org-unit correctly, add the "selected" attribute where appropriate
    if (props.org_unit === "News management") {
      document.getElementById("news_management").selected = true;
    } else if (props.org_unit === "software_reviews") {
      document.getElementById("Hardware reviews").selected = true;
    } else if (props.org_unit === "hardware_reviews") {
      document.getElementById("Software reviews").selected = true;
    } else if (props.org_unit === "Opinion publishing") {
      document.getElementById("opinion_publishing").selected = true;
    }

    // Upon first render, check if the form is of type "add new credential" or
    // "edit existing" credential. If the former, the form fields are required,
    // otherwise not.
    if (props.type === "add") {
      document.getElementById("name").required = true;
      document.getElementById("login").required = true;
      document.getElementById("password").required = true;
      document.getElementById("org_unit").required = true;
      document.getElementById("division").required = true;
    }
  }, []);

  return (
    <div className="credential-form">
      <div>
        <form onSubmit={handleSubmit}>
          <div className="form-fields">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
            ></input>

            <label htmlFor="login">Login:</label>
            <input
              type="text"
              id="login"
              name="login"
              value={login}
              onChange={handleChange}
            ></input>

            <label htmlFor="password">Password:</label>
            <input
              type="text"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
            ></input>

            <label htmlFor="org_unit">Organisational unit:</label>
            <select id="org_unit" name="org_unit" onChange={handleChange}>
              <option value="">Please select</option>
              <option id="news_management" value="News management">
                News management
              </option>
              <option id="software_reviews" value="Software reviews">
                Software reviews
              </option>
              <option id="hardware_reviews" value="Hardware reviews">
                Hardware reviews
              </option>
              <option id="opinion_publishing" value="Opinion publishing">
                Opinion publishing
              </option>
            </select>

            <label htmlFor="division">Division:</label>
            <input
              type="text"
              id="division"
              name="division"
              value={division}
              onChange={handleChange}
            ></input>
            <div></div>
            <input
              className="button"
              type="submit"
              value={props.type === "add" ? "Add credential" : "Submit edits"}
            ></input>
          </div>
        </form>
      </div>
    </div>
  );
};
