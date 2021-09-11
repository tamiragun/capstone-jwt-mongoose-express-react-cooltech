// Component that renders a single user, with options to edit fields

import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

export const EditUser = (props) => {
  // Use history to be able to link to other Routes.
  const history = useHistory();
  const location = useLocation();
  const { _id } = location.state || {
    _id: {},
  };
  const [user, setUser] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  // Declare states purely to control the form elements.
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
        if (jsonResponse.error) {
          console.log(jsonResponse.error);
          setIsError(jsonResponse.message);
        } else {
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
    event.preventDefault();
    // Call the server with the id as argument.
    const url = "/users/assign";
    const token = sessionStorage.getItem("token");
    let requestedFields = { _id: _id };
    if (event.target.name === "affiliation") {
      requestedFields.affiliation = { org_unit: org_unit, division: division };
    } else if (event.target.name === "role") {
      requestedFields.role = role;
    }
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
      if (jsonResponse.error) {
        console.log(jsonResponse.error);
        setIsError(jsonResponse.message);
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
    event.preventDefault();
    // Call the server with the id as argument.
    const url = "/users/unassign";
    const token = sessionStorage.getItem("token");

    const [org, div] = event.target.value.split(",");
    let requestedFields = {
      _id: _id,
      affiliation: { org_unit: org, division: div },
    };

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
    user &&
    user.affiliation.map((affiliation, i) => {
      return (
        <li key={"affiliation_" + i}>
          {`${affiliation.org_unit}, ${affiliation.division}`}
          <button
            name="affiliation"
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
          {!submitted &&
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
