import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";

export const HomePage = (props) => {
  const history = useHistory();
  const [loggedIn, setLoggedIn] = useState(false);
  const [org_unit, setOrg_unit] = useState([]);
  const [division, setDivision] = useState([]);

  // Check if the user is logged in (i.e. if a token is set)
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    (async () => {
      if (token) {
        setLoggedIn(true);
        const url = "/authentication/home";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: null,
        });
        const jsonResponse = await response.json();
        setOrg_unit(jsonResponse.org_unit);
        setDivision(jsonResponse.division);
      }
    })();
  }, []);

  const org_unit_list = org_unit.map((org_unit, i) => (
    <li key={"org_unit_" + i}>{org_unit}</li>
  ));
  const division_list = division.map((division, i) => (
    <li key={"division_" + i}>
      <button>{division}</button>
    </li>
  ));
  return (
    <div>
      {!loggedIn && (
        <div>
          <h2>
            Welcome! Register or log in to access your division's credentials:
          </h2>
          <button onClick={() => history.push("/login")}>Login</button>
          <button onClick={() => history.push("/register")}>Register</button>
        </div>
      )}
      {loggedIn && (
        <div>
          <h2>You are part of the following organisational units:</h2>
          {!org_unit ? "Loading..." : <ul>{org_unit_list}</ul>}
          <h2>Click to view your division's credentials:</h2>
          {!division ? "Loading..." : <ul>{division_list}</ul>}
        </div>
      )}
    </div>
  );
};
