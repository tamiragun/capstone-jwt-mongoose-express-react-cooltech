// Component that renders a single user, with options to edit fields

import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

export const EditUser = (props) => {
  // Use history to be able to link to other Routes.
  const history = useHistory();
  // Use location to be able to obtain the state of the route.
  const location = useLocation();
  // Obtain the state as was passed along in the route's redirect.
  const { _id } = location.state || {
    _id: {},
  };
  // The user to display based on the id provided int he route's state
  const [user, setUser] = useState();

  // Error toggle to capture any API call failures and display a user-friendly
  // error message.
  const [isError, setIsError] = useState(false);
  // Toggle whether the form has been submitted or not, which influences whether
  // the form or a success message is displayed.
  const [submitted, setSubmitted] = useState(false);

  // Some states purely to control the form elements.
  const [org_unit, setOrg_unit] = useState();
  const [division, setDivision] = useState("");
  const [role, setRole] = useState("");

  // Single handler for all controlled form elements, updates the corresponding
  // state depending on which field was typed in.
  const handleChange = (event) => {
    const currentValue = event.target.value;
    if (event.target.name === "org_unit") {
      setOrg_unit(currentValue);
    } else if (event.target.name === "division") {
      setDivision(currentValue);
    } else if (event.target.name === "role") {
      setRole(currentValue);
    }
  };

  // Upon first render, get the users and set the state
  useEffect(() => {
    // Async IIFE to call the server with the token and the user id, and get the user info
    (async () => {
      setIsError(false);
      try {
        const token = sessionStorage.getItem("token");
        const url = "/users/singleUser";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ _id: _id }),
        });
        const jsonResponse = await response.json();
        // If there has been an error, set the error state hook to the arror
        // message, which will then be displayed on the page.
        if (jsonResponse.error) {
          console.log(jsonResponse.error);
          setIsError(jsonResponse.message);
        } else {
          // If successful, update the state hook to contain the user info
          setUser(jsonResponse);
        }
      } catch (error) {
        console.log(error);
        setIsError(error);
      }
    })();
  }, [submitted]);

  // Handler for when an "assign" form is submitted
  const handleAssign = async (event) => {
    setIsError(false);
    // Prevent the browser from reloading
    event.preventDefault();

    const url = "/users/assign";
    // Obtain the token from session storage and the id from the state
    const token = sessionStorage.getItem("token");
    let requestedFields = { _id: _id };
    // Add fields to the object based on which "form" was submitted
    if (event.target.name === "affiliation") {
      requestedFields.affiliation = { org_unit: org_unit, division: division };
    } else if (event.target.name === "role") {
      requestedFields.role = role;
    }
    // Call the server with the final requested fields object in the body
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestedFields),
      });
      const jsonResponse = await response.json();
      // If there has been an error, set the error state hook to the arror
      // message, which will then be displayed on the page.
      if (jsonResponse.error) {
        console.log(jsonResponse.error);
        setIsError(jsonResponse.message);
        // If successful, display the success message and reset the form state hooks to blank
      } else {
        setDivision("");
        setOrg_unit(null);
        setRole(null);
        // Display success message
        setSubmitted(true);
      }
    } catch (error) {
      console.log(error);
      setIsError(error);
    }
  };

  const handleUnassign = async (event) => {
    setIsError(false);
    // Prevent the browser from reloading
    event.preventDefault();

    const url = "/users/unassign";
    // Obtain the token from session storage
    const token = sessionStorage.getItem("token");
    // Obtain the affiliation from the button that was clicked
    const [org, div] = event.target.value.split(",");
    // Obtain the id from state
    let requestedFields = {
      _id: _id,
      affiliation: { org_unit: org, division: div },
    };
    // Call the server with the final requested fields object in the body
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestedFields),
      });
      const jsonResponse = await response.json();
      // If there has been an error, set the error state hook to the arror
      // message, which will then be displayed on the page.
      if (jsonResponse.error) {
        console.log(jsonResponse.error);
        setIsError(jsonResponse.message);
      } else {
        // Display success message
        setSubmitted(true);
      }
    } catch (error) {
      console.log(error);
      setIsError(error);
    }
  };

  const affiliations =
    // First check that the user state has been loaded
    user &&
    // Create a list of affiliations for the user, each with a button to unassign the affiliation
    user.affiliation.map((affiliation, i) => {
      return (
        <li key={"affiliation_" + i}>
          {`${affiliation.org_unit}, ${affiliation.division}`}
          <button
            name="affiliation"
            // Set the button value to the affiliation so that upon submit it can be known which affiliation to unassign
            value={`${affiliation.org_unit},${affiliation.division}`}
            onClick={handleUnassign}
          >
            Unassign
          </button>
        </li>
      );
    });

  return (
    <div className="user-edit-form">
      {/*If there was any kind of error, display only the error message with nav buttons */}
      {isError ? (
        <div>
          Sorry! There was an eror performing this action:<br></br>
          {isError} <br></br>
          <button
            className="button nav-button"
            onClick={() => {
              setIsError(false);
              setSubmitted(false);
            }}
          >
            Go back
          </button>
        </div>
      ) : (
        <div>
          {/*If the submitted toggle is off, then display the user to edit. */}
          {!submitted &&
            /*If the user hasn't updated yet, display a holding message. */
            (!user ? (
              "Loading..."
            ) : (
              <div>
                <h2>Edit user: {user.name}</h2>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <form name="role" onSubmit={handleAssign}>
                  <label htmlFor="role">Change role to:</label>
                  <br></br>
                  <select
                    id="role"
                    name="role"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Please select</option>
                    <option value="normal">Normal</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <input type="submit" value="Change role"></input>
                </form>
                <p>
                  Affiliation: <ul>{affiliations}</ul>
                </p>
                <form name="affiliation" onSubmit={handleAssign}>
                  <label htmlFor="org_unit">
                    Assign new organisational unit:
                  </label>

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
                    <option value="Opinion publishing">
                      Opinion publishing
                    </option>
                  </select>
                  <br></br>
                  <label htmlFor="division">Assign new division:</label>

                  <input
                    type="text"
                    id="division"
                    name="division"
                    value={division}
                    onChange={handleChange}
                    required
                  ></input>
                  <br></br>
                  <input
                    className="button"
                    type="submit"
                    value="Assign"
                  ></input>
                </form>
              </div>
            ))}
          {/*If the submit toggle is on, then display the user edit form. */}
          {submitted && (
            <div>
              <h2>You succesfully updated the user.</h2>
              <button className="button" onClick={() => setSubmitted(false)}>
                Keep editing
              </button>
            </div>
          )}
        </div>
      )}
      <button
        className="button nav-button"
        onClick={() => history.push("/users")}
      >
        Back to all users
      </button>
      <button className="button nav-button" onClick={() => history.push("/")}>
        Home
      </button>
    </div>
  );
};
