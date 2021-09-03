// Component that renders all the users, only for admins

import React, { useEffect, useState } from "react";

export const AllUsers = (props) => {
  const [users, setUsers] = useState([]);

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
    return (
      <tr key={user._id}>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.org_unit}</td>
        <td>{user.division}</td>
        <td>{user.role}</td>
        <td>
          <button name="{user._id}">Edit user</button>
        </td>
      </tr>
    );
  });

  return (
    <div>
      {!users ? (
        "loading..."
      ) : (
        <table>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Organisational unit</th>
            <th>Division</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
          {userList}
        </table>
      )}
    </div>
  );
};
