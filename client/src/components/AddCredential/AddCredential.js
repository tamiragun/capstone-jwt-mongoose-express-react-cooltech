// Component that renders a single user, with options to edit fields

import React, { useState } from "react";
import { CredentialForm } from "../CredentialForm/CredentialForm";
import { useLocation, useHistory } from "react-router-dom";

export const AddCredential = (props) => {
  const [submitted, setSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  // Use history to be able to link to other Routes.
  const history = useHistory();
  const location = useLocation();
  const { credentialsToDisplay } = location.state || {
    credentialsToDisplay: {},
  };

  // Handler for when the form is submitted

  const handleSubmit = async (name, login, password, org_unit, division) => {
    // Call the server with the id as argument.
    setIsError(false);
    const url = "/credentials/create";
    const token = sessionStorage.getItem("token");
    let requestedFields = {
      _id: props.id,
      name: name,
      login: login,
      password: password,
      org_unit: org_unit,
      division: division,
    };
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
          {!submitted && (
            <div>
              <h2>Add new credential</h2>
              <div className="form-card">
                <CredentialForm type="add" formHandler={handleSubmit} />
              </div>
            </div>
          )}
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
