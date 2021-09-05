// Component that renders all the credentials, only for managers and admins

import React, { useEffect, useState } from "react";

export const AllCredentials = (props) => {
  const [credentials, setCredentials] = useState([]);
  const [displayEdit, setDisplayEdit] = useState(false);

  // Function to get the credentials from the server and set the state accordingly
  const getCredentials = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const url = "/credentials";
      const org_unit = props.org_unit;
      const division = props.division;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ division: division, org_unit: org_unit }),
      });
      const jsonResponse = await response.json();
      console.log(jsonResponse);
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
        <td>{credential.email}</td>
        <td>{credential.org_unit}</td>
        <td>{credential.division}</td>
        {displayEdit && (
          <td>
            <button name="{credential._id}">Edit credential</button>
          </td>
        )}
      </tr>
    );
  });

  return (
    <div>
      {!credentials ? (
        "loading..."
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Login</th>
              <th>Organisational unit</th>
              <th>Division</th>
              {displayEdit && <th>Action</th>}
            </tr>
          </thead>
          <tbody>{credentialList}</tbody>
        </table>
      )}
    </div>
  );
};
