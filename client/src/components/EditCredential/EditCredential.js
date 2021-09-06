// Component that renders a single user, with options to edit fields

import React, { useEffect, useState } from "react";
import { CredentialForm } from "../CredentialForm/CredentialForm";
import { useHistory } from "react-router-dom";

export const EditCredential = (props) => {
  // Use history to be able to link to other Routes.
  const history = useHistory();
  const [credential, setCredential] = useState();
  const [submitted, setSubmitted] = useState(false);

  // Function to get the credential from the server and set the state accordingly
  const getCredential = async () => {
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
      setCredential(jsonResponse);
    } catch (err) {
      console.log(err);
    }
  };

  // Upon first render, get the credential and set the state
  useEffect(() => {
    getCredential();
  }, []);

  // Handler for when the form is submitted

  const handleSubmit = async (name, login, password, org_unit, division) => {
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

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestedFields),
    });
    // Display success message
    setSubmitted(true);
    //getCredential();
  };

  return (
    <div className="credential-edit-form">
      {!submitted &&
        (!credential ? (
          "Loading..."
        ) : (
          <CredentialForm
            type="edit"
            formHandler={handleSubmit}
            name={credential.name}
            login={credential.login}
            password={credential.password}
            org_unit={credential.org_unit}
            division={credential.division}
          />
        ))}
      {submitted && (
        <div>
          <h2>Your credential was edited successfully.</h2>
          <button onClick={() => history.push("/")}>Home</button>
        </div>
      )}
    </div>
  );
};
