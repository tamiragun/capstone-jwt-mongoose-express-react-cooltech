// Component that renders all the credentials, only for managers and admins

import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router";
import { EditCredential } from "../EditCredential/EditCredential";
import "./AllCredentials.css";

export const AllCredentials = (props) => {
  const [credentials, setCredentials] = useState([]);
  const [displayEdit, setDisplayEdit] = useState(false);
  const [isError, setIsError] = useState(false);
  const [editCredential, setEditCredential] = useState();
  const location = useLocation();
  const { credentialsToDisplay } = location.state || {
    credentialsToDisplay: {},
  };
  // https://stackoverflow.com/a/61108147
  const history = useHistory();

  // Function to get the credentials from the server and set the state accordingly
  const getCredentials = async () => {
    setIsError(false);
    try {
      const token = sessionStorage.getItem("token");
      const url = "/credentials";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ affiliation: credentialsToDisplay }),
      });
      const jsonResponse = await response.json();
      if (jsonResponse.error) {
        console.log(jsonResponse.error);
        setIsError(jsonResponse.message);
      } else {
        setCredentials(jsonResponse);
      }
    } catch (error) {
      console.log(error);
      setIsError(error);
    }
  };

  // Check if the user has permission to edit

  const authenticate = async () => {
    setIsError(false);
    try {
      const token = sessionStorage.getItem("token");
      const url = "/credentials/updatePermission";
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
      } else if (jsonResponse.access) {
        setDisplayEdit(true);
      }
    } catch (error) {
      console.log(error);
      setIsError(error);
    }
  };

  // Upon first render, get the credentials and set the state
  useEffect(() => {
    getCredentials();
    authenticate();
  }, []);

  const credentialList = credentials.map((credential) => {
    return (
      <tr key={credential._id}>
        <td>{credential.name}</td>
        <td>{credential.login}</td>
        <td>{credential.password}</td>
        <td>{credential.org_unit}</td>
        <td>{credential.division}</td>
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
    setEditCredential(null);
  };

  return (
    <div className="all-credentials">
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
          {!editCredential &&
            (!credentials ? (
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
            ))}
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
