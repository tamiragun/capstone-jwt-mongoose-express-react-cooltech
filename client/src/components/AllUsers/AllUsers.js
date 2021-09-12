// Component that renders all the users, only for admins

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import "./AllUsers.css";

export const AllUsers = (props) => {
  // Use history to be able to link to other Routes.
  const history = useHistory();
  // Error toggle to capture any API call failures and display a user-friendly
  // error message.
  const [isError, setIsError] = useState(false);

  // The array of users to display
  const [users, setUsers] = useState([]);

  // Upon first render, get the users and set the state
  useEffect(() => {
    setIsError(false);
    // Async IIFE to call the server with the token:
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
        // If there has been an error, set the error state hook to the arror
        // message, which will then be displayed on the page.
        if (jsonResponse.error) {
          console.log(jsonResponse.error);
          setIsError(jsonResponse.message);
        } else {
          // If successful, store the list of users in the component's state hook
          setUsers(jsonResponse);
        }
      } catch (error) {
        console.log(error);
        setIsError(error);
      }
    })();
  }, []);

  // Once users are set by the useEfect hook, generate a JSX list of those users with an "edit" button each.
  const userList = users.map((user) => {
    // Within each user, generate a list of all their affiliations
    const affiliation_list = user.affiliation.map((affiliation, i) => (
      <li key={"affiliation_" + i}>
        <div>
          <strong>Org unit: </strong>
          {affiliation.org_unit}
        </div>
        <div>
          <strong>Division: </strong>
          {affiliation.division}
        </div>
      </li>
    ));

    return (
      <tr key={user._id}>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>
          <ul>{affiliation_list}</ul>
        </td>
        <td>{user.role}</td>
        <td>
          <button
            className="button"
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
        </div>
      ) : (
        <div>
          {/*If the users haven't updated yet, display a holding message. */}
          {!users ? (
            "loading..."
          ) : (
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Affiliation</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>{userList}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <button className="button nav-button" onClick={() => history.push("/")}>
        Home
      </button>
    </div>
  );
};
