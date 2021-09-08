// Component that renders all the users, only for admins

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

export const AllUsers = (props) => {
  const [users, setUsers] = useState([]);
  const history = useHistory();
  const [isError, setIsError] = useState(false);

  // Upon first render, get the users and set the state
  useEffect(() => {
    setIsError(false);
    (async () => {
      try {
        const token = sessionStorage.getItem("token");
        const url = "/users";
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
          setUsers(jsonResponse);
        }
      } catch (error) {
        console.log(error);
        setIsError(error);
      }
    })();
  }, []);

  const userList = users.map((user) => {
    const affiliation_list = user.affiliation.map((affiliation, i) => (
      <li key={"affiliation_" + i}>
        <div>Organisational unit: {affiliation.org_unit}</div>
        <div>Division: {affiliation.division}</div>
      </li>
    ));
    return (
      <tr key={user._id}>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{affiliation_list}</td>
        <td>{user.role}</td>
        <td>
          <button
            name={user._id}
            onClick={() => history.push("/users/edit", { _id: user._id })}
          >
            Edit user
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h2>All Cool Tech employees</h2>
      {isError ? (
        <div>
          Sorry! There was an eror performing this action:<br></br>
          {isError} <br></br>
          <button
            onClick={() => {
              history.goBack();
            }}
          >
            Go back
          </button>
        </div>
      ) : (
        <div>
          {!users ? (
            "loading..."
          ) : (
            <table>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Affiliation</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
              {userList}
            </table>
          )}
        </div>
      )}

      <button onClick={() => history.push("/")}>Home</button>
    </div>
  );
};
