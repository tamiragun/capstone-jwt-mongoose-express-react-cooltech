// Component that renders a single user, with options to edit fields

import React, { useState } from "react";
import { CredentialForm } from "../CredentialForm/CredentialForm";
import { useHistory } from "react-router-dom";

export const AddCredential = (props) => {
  const [submitted, setSubmitted] = useState(false);
  // Use history to be able to link to other Routes.
  const history = useHistory();

  // Handler for when the form is submitted

  const handleSubmit = async (name, login, password, org_unit, division) => {
    // Call the server with the id as argument.
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
  };

  return (
    <div>
      {!submitted && (
        <div className="credential-edit-form">
          <CredentialForm type="add" formHandler={handleSubmit} />
        </div>
      )}
      {submitted && (
        <div>
          <h2>Your credential was submitted successfully.</h2>
          <button onClick={() => history.push("/")}>Home</button>
        </div>
      )}
    </div>
  );
};
