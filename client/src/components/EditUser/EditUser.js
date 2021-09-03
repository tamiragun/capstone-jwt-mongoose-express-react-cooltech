// Component that renders a single user, with options to edit fields

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export const EditUser = (props) => {
  // Use history to be able to link to other Routes.
  const history = useHistory();
  const [user, setUser] = useState();
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
        body: JSON.stringify({ _id: props.id }),
      });
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      setUser(jsonResponse);
    } catch (err) {
      console.log(err);
    }
  };

  // Upon first render, get the users and set the state
  useEffect(() => {
    getUser();
  }, []);

  //   // Handler for when the final form is submitted.
  //   const handleRemoveOrgUnit = async (event) => {

  //     // Call the server with the id as argument.
  //     const url = "/users/unassign";
  //     const org_unit = event.target.name;
  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: { "Content-type": "application/json" },
  //       body: JSON.stringify({
  //         _id: props.id,
  //         org_unit: org_unit,
  //       }),
  //     });
  //     const jsonResponse = await response.json();

  //     if (jsonResponse.err) {
  //       //Display an alert to the user?
  //       console.log(jsonResponse.err);
  //     }
  //     if (jsonResponse.token) {
  //       //store jwt and user info in sessionStrorage
  //       sessionStorage.setItem("token", jsonResponse.token);
  //       console.log(sessionStorage.getItem("token"));
  //       // Reset the states back to empty, so that the form looks blank again.
  //       setName("");
  //       setEmail("");
  //       setPassword("");
  //       setOrg_unit(null);
  //       setDivision("");

  //       // Redirect the user to the next page.
  //       //ADAPT THIS
  //       history.push("/");
  //     }
  //   };

  return (
    <div className="register-form">
      {/* <form onSubmit={handleSubmit}>
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
      </form> */}
      {!user ? (
        "Loading..."
      ) : (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <form>
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
          <p>Organizational unit: {user.org_unit}</p>
          <form>
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
          <p>Division: {user.division}</p>
          <form>
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
            <br></br>
            <br></br>

            <input type="submit" value="Assign"></input>
          </form>
        </div>
      )}
    </div>
  );
};
