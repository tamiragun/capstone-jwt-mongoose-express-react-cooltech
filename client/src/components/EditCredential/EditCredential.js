// Component that renders a single user, with options to edit fields

import React, { useEffect, useState } from "react";
import { CredentialForm } from "../CredentialForm/CredentialForm";
import { useHistory } from "react-router-dom";
import "./EditCredential.css";

export const EditCredential = (props) => {
  // Use history to be able to link to other Routes.
  const history = useHistory();
  const [credential, setCredential] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  // Upon first render, get the credential and set the state
  useEffect(() => {
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
        if (jsonResponse.error) {
          console.log(jsonResponse.error);
          setIsError(jsonResponse.message);
        } else {
          setCredential(jsonResponse);
        }
      } catch (error) {
        console.log(error);
        setIsError(error);
      }
    })();
  }, [submitted]);

  // Handler for when the form is submitted

  const handleSubmit = async (name, login, password, org_unit, division) => {
    setIsError(false);
    // Call the server with the id as argument.
    const url = "/credentials/update";
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
      const jsonResponse = await response.json();
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
          {!submitted &&
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
