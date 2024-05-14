import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./OwnedDocuments.css";
import Cookies from "js-cookie";

function OwnedDocuments() {
  const [documents, setDocuments] = useState([]);
  const token = Cookies.get("token");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {

    console.log("tokenndoccccc==============", token);
    axios
      .get(`http://localhost:8080/api/files/shared`, config)
      .then((response) => {
        console.log("responseee==", response);
        setDocuments(response.data);



      })
      .catch((error) => {
        console.error("Errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:", error);
      });
  }, []);



  const handleShare = (documentId) => {
    // Handle share action
  };

  const handleOpen = (documentId) => {
    // Handle open action
  };



  return (
    <div className="owned-documents">
      <h2>Shared Documents</h2>
      <div className="document-list">
        {documents.map((document) => (
          <div key={document.id} className="document-block">
            <h3>{document.name}</h3>
            <div className="button-container">
              <button onClick={() => handleOpen(document.id)}>Open</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default OwnedDocuments;
