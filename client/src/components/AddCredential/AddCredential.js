// Component that renders a single user, with options to edit fields

import React from "react";
import { CredentialForm } from "../CredentialForm/CredentialForm";
//import { useHistory } from "react-router-dom";

export const AddCredential = (props) => {
  // Use history to be able to link to other Routes.
  //const history = useHistory();

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
    // DISPLAY SUCCESS MESSAGE
  };

  return (
    <div className="credential-edit-form">
      <CredentialForm type="add" formHandler={handleSubmit} />
    </div>
  );
};
