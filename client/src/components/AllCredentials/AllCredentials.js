// Component that renders all the credentials of a given affiliation

import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router";
import { EditCredential } from "../EditCredential/EditCredential";
import "./AllCredentials.css";

export const AllCredentials = (props) => {
  // Use history to be able to link to other Routes.
  const history = useHistory();
  // Use location to be able to obtain the state of the route.
  const location = useLocation();
  // Obtain the state as was passed along in the route's redirect.
  // Courtesy of https://stackoverflow.com/a/61108147
  const { credentialsToDisplay } = location.state || {
    credentialsToDisplay: {},
  };
  // The array of credentials to display based on the affiliation provided in the state
  const [credentials, setCredentials] = useState([]);

  // Error toggle to capture any API call failures and display a user-friendly
  // error message.
  const [isError, setIsError] = useState(false);
  // Toggle whether or not a user has clearance to edit credentials (i.e. if
  // they are a manager or admin). This will influence if the "edit credential"
  // buttons are displayed or not.
  const [displayEdit, setDisplayEdit] = useState(false);
  // Toggle whether or not to display a single credential for editing instead
  // of the full list of credentials
  const [editCredential, setEditCredential] = useState();

  // Helper function to get the credentials from the server and set the state accordingly
  const getCredentials = async () => {
    setIsError(false);
    try {
      const token = sessionStorage.getItem("token");
      const url = "/credentials";
      // Call the server to check the token and obtain the list of credentials
      // for the affiliation provided in the request body
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ affiliation: credentialsToDisplay }),
      });
      const jsonResponse = await response.json();
      // If there has been an error, set the error state hook to the arror
      // message, which will then be displayed on the page.
      if (jsonResponse.error) {
        console.log(jsonResponse.error);
        setIsError(jsonResponse.message);
        // If successful, store the list of credentials in the component's state
      } else {
        setCredentials(jsonResponse);
      }
    } catch (error) {
      console.log(error);
      setIsError(error);
    }
  };

  // Helper function to check if the user has permission to edit
  const authenticate = async () => {
    setIsError(false);
    try {
      const token = sessionStorage.getItem("token");
      const url = "/credentials/updatePermission";
      // Call the server to check the token and obtain the permission
      // based on its payload
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
        // If successful, update the state hook to enable displaying the "edit credentials" buttons
      } else if (jsonResponse.access) {
        setDisplayEdit(true);
      }
    } catch (error) {
      console.log(error);
      setIsError(error);
    }
  };

  // Upon first render, call both helper functions to obtain the credentials and
  // determine whether to display the "edit credentials" button or not.
  useEffect(() => {
    getCredentials();
    authenticate();
  }, []);

  // Once credentials are set by the useEfect hook, generate a JSX list of those credentials with an "edit" button each.
  const credentialList = credentials.map((credential) => {
    return (
      <tr key={credential._id}>
        <td>{credential.name}</td>
        <td>{credential.login}</td>
        <td>{credential.password}</td>
        <td>{credential.org_unit}</td>
        <td>{credential.division}</td>
        {/* Only display the buttons if the user had permission to edit credentials */}
        {displayEdit && (
          <td>
            <button
              className="button"
              name={credential._id}
              onClick={() => setEditCredential(credential._id)}
            >
              Edit credential
            </button>
          </td>
        )}
      </tr>
    );
  });

  // Handler for when a user wants to return to credentials after editing one
  const returnToCredentials = () => {
    // Set editCredential toggle to null, which means the list of credentials is displayed instead.
    setEditCredential(null);
  };

  return (
    <div className="all-credentials">
      {/*If there was any kind of error, display only the error message with nav buttons */}
      {isError ? (
        <div>
          Sorry! There was an eror performing this action:<br></br>
          {isError} <br></br>
          <button
            className="button nav-button"
            onClick={() => {
              history.goBack();
            }}
          >
            Go back
          </button>
          <button
            className="button nav-button"
            onClick={() => history.push("/")}
          >
            Go home
          </button>
        </div>
      ) : (
        <div>
          {/*If the edit credentialtoggle is off, then display the list of credentials. */}
          {!editCredential &&
            {
              /*If the credentials haven't updated yet, display a holding message. */
            }(
              !credentials ? (
                "loading..."
              ) : (
                <div>
                  <h2>All credentials for:</h2>
                  <div className="affiliation-button">
                    <div>
                      <p>
                        <strong>Organisational unit: </strong>
                      </p>
                      <p>
                        <strong>Division: </strong>
                      </p>
                    </div>
                    <div>
                      <p>{credentialsToDisplay.org_unit}</p>
                      <p>{credentialsToDisplay.division}</p>
                    </div>
                  </div>
                  <div className="credentials-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Login</th>
                          <th>Password</th>
                          <th>Organisational unit</th>
                          <th>Division</th>
                          {displayEdit && <th>Action</th>}
                        </tr>
                      </thead>
                      <tbody>{credentialList}</tbody>
                    </table>
                  </div>
                  <button
                    className="button nav-button"
                    onClick={() =>
                      history.push("/credentials/add", { credentialsToDisplay })
                    }
                  >
                    Add new credential
                  </button>
                  <button
                    className="button nav-button"
                    onClick={() => history.push("/")}
                  >
                    Home
                  </button>
                </div>
              )
            )}
          {/*If the edit credentialtoggle is on, then display the credential edit form. */}
          {editCredential && (
            <EditCredential
              id={editCredential}
              returnToCredentials={returnToCredentials}
            />
          )}
        </div>
      )}
    </div>
  );
};
