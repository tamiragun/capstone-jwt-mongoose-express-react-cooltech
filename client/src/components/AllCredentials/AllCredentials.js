// Component that renders all the credentials, only for managers and admins

import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router";
import { EditCredential } from "../EditCredential/EditCredential";

export const AllCredentials = (props) => {
  const [credentials, setCredentials] = useState([]);
  const [displayEdit, setDisplayEdit] = useState(false);
  const [editCredential, setEditCredential] = useState();
  const location = useLocation();
  const { credentialsToDisplay } = location.state || {
    credentialsToDisplay: {},
  };
  // https://stackoverflow.com/a/61108147
  const history = useHistory();

  // Function to get the credentials from the server and set the state accordingly
  const getCredentials = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const url = "/credentials";
      //   const org_unit = props.org_unit;
      //   const division = props.division;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ affiliation: credentialsToDisplay }),
      });
      const jsonResponse = await response.json();
      //console.log(jsonResponse);
      setCredentials(jsonResponse);
    } catch (err) {
      console.log(err);
    }
  };

  // Check if the user has permission to edit

  const authenticate = async () => {
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
      if (jsonResponse.access) {
        setDisplayEdit(true);
      }
    } catch (err) {
      console.log(err);
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
    <div>
      {!editCredential &&
        (!credentials ? (
          "loading..."
        ) : (
          <div>
            <h2>All credentials for:</h2>
            <h3>
              Organisational unit: {credentialsToDisplay.org_unit}
              <br></br>
              Division: {credentialsToDisplay.division}
            </h3>
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
            <button
              onClick={() =>
                history.push("/credentials/add", { credentialsToDisplay })
              }
            >
              Add new credential
            </button>
            <button onClick={() => history.push("/")}>Home</button>
          </div>
        ))}
      {editCredential && (
        <EditCredential
          id={editCredential}
          returnToCredentials={returnToCredentials}
        />
      )}
    </div>
  );
};
