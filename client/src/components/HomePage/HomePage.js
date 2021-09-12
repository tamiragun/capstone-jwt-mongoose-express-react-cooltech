// Component that renders either the list of affiliations of a logged in user,
// or login/registration options when the user is not logged in.

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import "./HomePage.css";

export const HomePage = (props) => {
  // Use history to be able to link to other Routes.
  const history = useHistory();
  // Error toggle to capture any API call failures and display a user-friendly
  // error message.
  const [isError, setIsError] = useState(false);
  // Toggle whether or not a user is logged in, this will influence whether
  // the logins or the affiliations are displayed.
  const [loggedIn, setLoggedIn] = useState(false);
  // The array of affiliations to display if a user is logged in
  const [affiliation, setAffiliation] = useState([]);
  // The JSX version of the list of affiliations
  const [affiliationList, setAffiliationList] = useState();
  // The role of the user, which will influence whether the admin section is
  // displayed or not
  const [role, setRole] = useState();

  // Upon first render, check if the user is logged in (i.e. if a token is set)
  useEffect(() => {
    setIsError(false);
    const token = sessionStorage.getItem("token");
    // Async IIFE to call the server with this token:
    (async () => {
      // If a token is set, toggle the state to logged in and call the server
      if (token) {
        setLoggedIn(true);
        const url = "/authentication/home";
        // Call the server to check the token and obtain the role and affiliation
        // based on its payload
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
          // If there has been an error, set the error state hook to the arror
          // message, which will then be displayed on the page.
          if (jsonResponse.error) {
            console.log(jsonResponse.error);
            setIsError(jsonResponse.message);
          } else {
            // If successful, store the user's role and affiliation in the component's state
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

  // Once the affiliation state hook has been set by the first useEffect hook,
  // use that data to generate a JSX list of affiliations to display. This is
  // done with a second state hook and second useEffect hook, because the first
  // state hook is asynchronous and we need to wait for it to be set before we
  // can use the data to create the JSX list.
  useEffect(() => {
    // First check if affiliation state hook is set. If not, do nothing. This
    // useEffect will trigger again if anything about the affiliation state hook
    // changes.
    if (affiliation) {
      // Once it is set, check that it isn't empty.
      if (affiliation.length > 0) {
        // If not, map over the array and create li elements with a button each.
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
        // Store this array in a new state hook, to be rendered later on.
        setAffiliationList(affiliation_list);
        // If the array is empty, display an error message isntead of the unordered list.
      } else {
        const affiliation_list = `You are not affiliated with 
        any organisational unit or division. Please contact an admin 
        to assign the organisational unit and division.`;
        setAffiliationList(affiliation_list);
      }
    }
    // Run this useEffect every time the affiliation state updates
  }, [affiliation]);

  // Handler for when a "view division" button is clicked
  const handleClick = (event) => {
    // Obtain the org unit and division from the button's name
    const [org_unit, division] = event.target.name.split(",");
    // Save those into an object
    const credentialsToDisplay = { org_unit: org_unit, division: division };
    // Redirect the user to a new route, and store this object in its state.
    history.push("/credentials", { credentialsToDisplay });
  };

  return (
    <div className="home-page">
      {/*If there was any kind of error, display only the error message with nav buttons */}
      {isError ? (
        <div>
          Sorry! There was an eror performing this action:<br></br>
          {isError}
        </div>
      ) : (
        <div>
          {/*If the user is not logged in, display the login/registration options */}
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
          {/*If the user is logged in, display the list of affiliations te user belongs to */}
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
          {/*If the user is an admin, also display the admin section */}
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
