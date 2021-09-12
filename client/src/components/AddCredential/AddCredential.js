// Component that renders a form to add a new credential, accessible to all user roles

import React, { useState } from "react";
import { CredentialForm } from "../CredentialForm/CredentialForm";
import { useLocation, useHistory } from "react-router-dom";

export const AddCredential = (props) => {
  // Use history to be able to link to other Routes.
  const history = useHistory();
  // Use location to be able to obtain the state of the route.
  const location = useLocation();
  // Obtain the state as was passed along in the route's redirect.
  const { credentialsToDisplay } = location.state || {
    credentialsToDisplay: {},
  };

  // Error toggle to capture any API call failures and display a user-friendly
  // error message.
  const [isError, setIsError] = useState(false);
  // Toggle whether the form has been submitted or not, which influences whether
  // the form or a success message is displayed.
  const [submitted, setSubmitted] = useState(false);

  // Handler for when the form is submitted
  const handleSubmit = async (name, login, password, org_unit, division) => {
    setIsError(false);
    const url = "/credentials/create";
    const token = sessionStorage.getItem("token");
    // Obtain the requested fields from the child component's event handler
    let requestedFields = {
      _id: props.id,
      name: name,
      login: login,
      password: password,
      org_unit: org_unit,
      division: division,
    };
    // Call the server with the final requested fields object in the body
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestedFields),
      });
      const jsonResponse = response.json();
      // If there has been an error, set the error state hook to the arror
      // message, which will then be displayed on the page.
      if (jsonResponse.error) {
        console.log(jsonResponse.error);
        setIsError(jsonResponse.message);
      } else {
        // Display success message
        setSubmitted(true);
      }
    } catch (error) {
      console.log(error);
      setIsError(error);
    }
  };

  return (
    <div>
      {/*If there was any kind of error, display only the error message with nav buttons */}
      {isError ? (
        <div>
          Sorry! There was an eror performing this action:<br></br>
          {isError} <br></br>
          <button
            className="button nav-button"
            onClick={() => {
              setIsError(false);
              setSubmitted(false);
            }}
          >
            Go back
          </button>
        </div>
      ) : (
        <div>
          {/*If the submitted toggle is off, then display the add credential form. */}
          {!submitted && (
            <div>
              <h2>Add new credential</h2>
              <div className="form-card">
                <CredentialForm type="add" formHandler={handleSubmit} />
              </div>
            </div>
          )}
          {/*If the submit toggle is on, then display the add credential form. */}
          {submitted && (
            <div>
              <h2>Your credential was submitted successfully.</h2>
            </div>
          )}
        </div>
      )}
      <button
        className="button nav-button"
        onClick={() => history.push("/credentials", { credentialsToDisplay })}
      >
        Back to credentials
      </button>
      <button className="button nav-button" onClick={() => history.push("/")}>
        Home
      </button>
    </div>
  );
};
