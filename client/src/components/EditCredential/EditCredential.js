// Component that renders a single user, with options to edit fields

import React, { useEffect, useState } from "react";
//import { useHistory } from "react-router-dom";

export const EditCredential = (props) => {
  // Use history to be able to link to other Routes.
  //const history = useHistory();
  const [credential, setCredential] = useState();
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

  // Function to get the credential from the server and set the state accordingly
  const getCredential = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const url = "/credentials/display";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ _id: props.id }),
      });
      const jsonResponse = await response.json();
      await setCredential(jsonResponse);
      setName(credential.name);
      setLogin(credential.login);
      setPassword(credential.password);
      setOrg_unit(credential.org_unit);
      if (org_unit === "News management") {
        document.getElementById("news_management").selected = true;
      } else if (org_unit === "software_reviews") {
        document.getElementById("Hardware reviews").selected = true;
      } else if (org_unit === "hardware_reviews") {
        document.getElementById("Software reviews").selected = true;
      } else if (org_unit === "Opinion publishing") {
        document.getElementById("opinion_publishing").selected = true;
      }
      setDivision(credential.division);
    } catch (err) {
      console.log(err);
    }
  };

  // Upon first render, get the users and set the state
  useEffect(() => {
    getCredential();
    //TODO: THIS IS NOT RENDERING IN TIME!!
  }, []);

  // Handler for when the form is submitted

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Call the server with the id as argument.
    const url = "/credentials/update";
    const token = sessionStorage.getItem("token");
    let requestedFields = {
      _id: props.id,
      name: name,
      login: login,
      password: password,
      org_unit: org_unit,
      division: division,
    };

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestedFields),
    });
    // DISPLAY SUCCESS MESSAGE

    getCredential();
  };

  return (
    <div className="credential-edit-form">
      {!credential ? (
        "Loading..."
      ) : (
        <div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
            ></input>
            <br></br>

            <label htmlFor="login">Login:</label>
            <input
              type="text"
              id="login"
              name="login"
              value={login}
              onChange={handleChange}
            ></input>
            <br></br>

            <label htmlFor="password">Password:</label>
            <input
              type="text"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
            ></input>
            <br></br>

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
            <br></br>

            <label htmlFor="division">Division:</label>
            <input
              type="text"
              id="division"
              name="division"
              value={division}
              onChange={handleChange}
            ></input>
            <br></br>
            <input type="submit" value="Submit edits"></input>
          </form>
        </div>
      )}
    </div>
  );
};
