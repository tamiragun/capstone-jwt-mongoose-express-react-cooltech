import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";

export const HomePage = (props) => {
  const history = useHistory();
  const [loggedIn, setLoggedIn] = useState(false);
  const [affiliation, setAffiliation] = useState([]);
  const [role, setRole] = useState();
  const [affiliationList, setAffiliationList] = useState();

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
        setRole(jsonResponse.role);
        setAffiliation(jsonResponse.affiliation);
      }
    })();
  }, []);

  // Handler for when a "view" button is clicked

  const handleClick = (event) => {
    const [org_unit, division] = event.target.name.split(",");
    const credentialsToDisplay = { org_unit: org_unit, division: division };
    console.log(org_unit);
    console.log(division);
    history.push("/credentials", { credentialsToDisplay });
  };

  useEffect(() => {
    if (affiliation) {
      const affiliation_list = affiliation.map((element, i) => (
        <li key={"affiliation_" + i}>
          <div>Organisational unit: {element.org_unit}</div>
          <div>Division: {element.division}</div>
          <button
            name={`${element.org_unit},${element.division}`}
            onClick={handleClick}
          >
            View
          </button>
        </li>
      ));
      setAffiliationList(affiliation_list);
    }
  }, [affiliation]);

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
          <h2>Cool tech</h2>
          <h3>Your division's credentials:</h3>
          {!affiliationList ? "Loading..." : <ul>{affiliationList}</ul>}
        </div>
      )}
      {role === "admin" && (
        <div>
          <h3>Admin section:</h3>
          <button onClick={() => history.push("/users")}>View all users</button>
        </div>
      )}
    </div>
  );
};
