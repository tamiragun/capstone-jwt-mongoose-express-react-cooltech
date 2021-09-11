import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import "./HomePage.css";

export const HomePage = (props) => {
  const history = useHistory();
  const [loggedIn, setLoggedIn] = useState(false);
  const [affiliation, setAffiliation] = useState([]);
  const [role, setRole] = useState();
  const [affiliationList, setAffiliationList] = useState();
  const [isError, setIsError] = useState(false);

  // Check if the user is logged in (i.e. if a token is set)
  useEffect(() => {
    setIsError(false);
    const token = sessionStorage.getItem("token");
    (async () => {
      if (token) {
        setLoggedIn(true);
        const url = "/authentication/home";
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: null,
          });
          const jsonResponse = await response.json();
          if (jsonResponse.error) {
            console.log(jsonResponse.error);
            setIsError(jsonResponse.message);
          } else {
            setRole(jsonResponse.role);
            setAffiliation(jsonResponse.affiliation);
          }
        } catch (error) {
          console.log(error);
          setIsError(error);
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (affiliation) {
      if (affiliation.length > 0) {
        const affiliation_list = affiliation.map((element, i) => (
          <li key={"affiliation_" + i}>
            <div className="affiliation-bullet">
              <div>
                <p>
                  <strong>Organisational unit: </strong>
                </p>
                <p>
                  <strong>Division: </strong>
                </p>
              </div>
              <div>
                <p>{element.org_unit}</p>
                <p>{element.division}</p>
              </div>
            </div>
            <button
              name={`${element.org_unit},${element.division}`}
              onClick={handleClick}
              className="button"
            >
              View
            </button>
          </li>
        ));
        setAffiliationList(affiliation_list);
      } else {
        const affiliation_list = `You are not affiliated with 
        any organisational unit or division. Please contact an admin 
        to assign the organisational unit and division.`;
        setAffiliationList(affiliation_list);
      }
    }
  }, [affiliation]);

  // Handler for when a "view" button is clicked

  const handleClick = (event) => {
    const [org_unit, division] = event.target.name.split(",");
    const credentialsToDisplay = { org_unit: org_unit, division: division };
    console.log(org_unit);
    console.log(division);
    history.push("/credentials", { credentialsToDisplay });
  };

  return (
    <div className="home-page">
      {isError ? (
        <div>
          Sorry! There was an eror performing this action:<br></br>
          {isError}
        </div>
      ) : (
        <div>
          {!loggedIn && (
            <div>
              <h2>Register or log in to access your division's credentials:</h2>
              <button
                className="button nav-button"
                onClick={() => history.push("/login")}
              >
                Login
              </button>
              <button
                className="button nav-button"
                onClick={() => history.push("/register")}
              >
                Register
              </button>
            </div>
          )}
          {loggedIn && (
            <div className="card">
              <h3>Your division's credentials:</h3>
              {!affiliationList ? (
                "Loading..."
              ) : (
                <ul className="affiliation-list">{affiliationList}</ul>
              )}
            </div>
          )}
          {role === "admin" && (
            <div className="card">
              <h3>Admin section:</h3>
              <button
                className="button nav-button"
                onClick={() => history.push("/users")}
              >
                View all users
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
