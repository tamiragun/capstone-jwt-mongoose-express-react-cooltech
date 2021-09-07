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

  // Function to get the user from the server and set the state accordingly
  const getUser = async () => {
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
      setUser(jsonResponse);
    } catch (err) {
      console.log(err);
    }
  };

  // Upon first render, get the users and set the state
  useEffect(() => {
    getUser();
  }, [submitted]);

  // Handler for when an "assign" form is submitted

  const handleAssign = async (event) => {
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
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestedFields),
    });
    //const jsonResponse = await response.json();
    setDivision("");
    setOrg_unit(null);
    setRole(null);
    // Display success message
    setSubmitted(true);
    //getUser();
  };

  const handleUnassign = async (event) => {
    event.preventDefault();
    // Call the server with the id as argument.
    const url = "/users/unassign";
    const token = sessionStorage.getItem("token");

    const [org, div] = event.target.value.split(",");
    let requestedFields = {
      _id: _id,
      affiliation: { org_unit: org, division: div },
    };
    console.log(requestedFields);

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestedFields),
    });
    // Display success message
    setSubmitted(true);
    //getUser();
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
              <select id="role" name="role" onChange={handleChange} required>
                <option value="">Please select</option>
                <option value="normal">Normal</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
              <input type="submit" value="Change role"></input>
            </form>
            {/* <p>
              Organizational unit: <ul>{org_units}</ul>
            </p>
            <form name="org_unit" onSubmit={handleAssign}>
              <label htmlFor="org_unit">Assign new organisational unit:</label>
              <br></br>
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
              <input type="submit" value="Assign "></input>
              <br></br>
            </form>
            <p>
              Division: <ul>{divisions}</ul>
            </p>
            <form name="division" onSubmit={handleAssign}>
              <label htmlFor="division">Assign new division:</label>
              <br></br>
              <input
                type="text"
                id="division"
                name="division"
                value={division}
                onChange={handleChange}
                required
              ></input>

              <input type="submit" value="Assign"></input>
            </form> */}
            <p>
              Affiliation: <ul>{affiliations}</ul>
            </p>
            <form name="affiliation" onSubmit={handleAssign}>
              <label htmlFor="org_unit">Assign new organisational unit:</label>

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
              <input type="submit" value="Assign"></input>
            </form>
          </div>
        ))}
      {submitted && (
        <div>
          <h2>You succesfully updated the user.</h2>
          <button onClick={() => setSubmitted(false)}>Keep editing</button>
        </div>
      )}
      <button onClick={() => history.push("/users")}>Back to all users</button>
      <button onClick={() => history.push("/")}>Home</button>
    </div>
  );
};
