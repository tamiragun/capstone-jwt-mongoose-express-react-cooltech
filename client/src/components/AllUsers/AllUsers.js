// Component that renders all the users, only for admins

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

export const AllUsers = (props) => {
  const [users, setUsers] = useState([]);
  const history = useHistory();

  // Function to get the users from the server and set the state accordingly
  const getUsers = async () => {
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
      console.log(jsonResponse);
      setUsers(jsonResponse);
    } catch (err) {
      console.log(err);
    }
  };

  // Upon first render, get the users and set the state
  useEffect(() => {
    getUsers();
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
            onClick={(event) => history.push("/users/edit", { _id: user._id })}
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

      <button onClick={() => history.push("/")}>Home</button>
    </div>
  );
};
