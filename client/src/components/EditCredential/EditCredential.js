// Component that renders a single credential, with options to edit fields

import React, { useEffect, useState } from "react";
import { CredentialForm } from "../CredentialForm/CredentialForm";
import { useHistory } from "react-router-dom";
import "./EditCredential.css";

export const EditCredential = (props) => {
  // Use history to be able to link to other Routes.
  const history = useHistory();
  // The credential to display based on the prop
  const [credential, setCredential] = useState();
  // Error toggle to capture any API call failures and display a user-friendly
  // error message.
  const [isError, setIsError] = useState(false);
  // Toggle whether the form has been submitted or not, which influences whether
  // the form or a success message is displayed.
  const [submitted, setSubmitted] = useState(false);

  // Upon first render, get the credential and set the state
  useEffect(() => {
    // Async IIFE to call the server with the token and credential id from the
    // props, and get the credential
    (async () => {
      setIsError(false);
      try {
        const token = sessionStorage.getItem("token");
        const url = "/credentials/display";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ _id: props.id }),
        });
        const jsonResponse = await response.json();
        // If there has been an error, set the error state hook to the arror
        // message, which will then be displayed on the page.
        if (jsonResponse.error) {
          console.log(jsonResponse.error);
          setIsError(jsonResponse.message);
        } else {
          // If successful, update the state hook to contain the credential info
          setCredential(jsonResponse);
        }
      } catch (error) {
        console.log(error);
        setIsError(error);
      }
    })();
  }, [submitted]);

  // Handler for when the form is submitted (this will happen ont he child component)
  const handleSubmit = async (name, login, password, org_unit, division) => {
    setIsError(false);
    const url = "/credentials/update";
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
      const jsonResponse = await response.json();
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
    <div className="credential-edit-form">
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
          {/*If the submitted toggle is off, then display the credential to edit. */}
          {!submitted &&
            /*If the credential hasn't updated yet, display a holding message. */
            (!credential ? (
              "Loading..."
            ) : (
              <div>
                <h2>Edit credential: {credential.name}</h2>
                <div className="form-card">
                  <CredentialForm
                    type="edit"
                    formHandler={handleSubmit}
                    name={credential.name}
                    login={credential.login}
                    password={credential.password}
                    org_unit={credential.org_unit}
                    division={credential.division}
                  />
                </div>
              </div>
            ))}
          {/*If the submit toggle is on, then display the credential edit form. */}
          {submitted && (
            <div>
              <h2>Your credential was edited successfully.</h2>
            </div>
          )}
        </div>
      )}
      <button className="button nav-button" onClick={props.returnToCredentials}>
        Back to credentials
      </button>
      <button className="button nav-button" onClick={() => history.push("/")}>
        Home
      </button>
    </div>
  );
};
