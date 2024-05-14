import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./OwnedDocuments.css";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function OwnedDocuments() {
  const [documents, setDocuments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showForm2, setShowForm2] = useState(false);
  const [showForm3, setShowForm3] = useState(false);
  const [newDocumentName, setNewDocumentName] = useState('');
  const [newReName, setNewReName] = useState('');
  const [ShareUsername, setShareUsername] = useState('');
  const [newReNameid, setNewReNameid] = useState('');
  const [Shareid, setShareid] = useState('');
  const [userType, setUserType] = useState("Editor"); // Default to Editor


  const navigate = useNavigate(); // Initialize useNavigate


  const token = Cookies.get("token");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };





  useEffect(() => {

    console.log("tokenndoccccc==============", token);
    axios
      .get(`http://localhost:8080/api/files/my`, config)
      .then((response) => {
        console.log("responseee==", response);
        setDocuments(response.data);



      })
      .catch((error) => {
        console.error("Errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:", error);
      });
  }, []);

  const handleSubmitForm = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/files',
        { fileName: newDocumentName }, // Sending data in the required format
        { headers: { Authorization: `Bearer ${token}` } } // Config object with headers
      );
      const newDocument = response.data.document;
      console.log("New Document:", newDocument); // Log the new document

      // Update documents state by adding the new document
      //setDocuments([...documents, newDocument]);
      setShowForm(false);
      setShowForm2(false);
      setShowForm3(false);


      // Close the form after successful creation
      //setNewDocumentName(''); // Clear the input field
      axios
        .get(`http://localhost:8080/api/files/my`, config)
        .then((response) => {
          console.log("responseeeidddd==", response.data.id);
          setDocuments(response.data);



        })
        .catch((error) => {
          console.error("Errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:", error);
        });
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };


  const handleDoRename = async (documentId) => {
    try {

      const response = await axios.put(
        `http://localhost:8080/api/files/rename/${newReNameid}`,
        { fileName: newReName },
        config
      );
      console.log(response);
      setShowForm2(false);
      setShowForm3(false);

      axios
        .get(`http://localhost:8080/api/files/my`, config)
        .then((response) => {
          console.log("responseeeidddd==", response.data.id);
          setDocuments(response.data);



        })
        .catch((error) => {
          console.error("Errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:", error);
        });
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };



  const handleDoShare = async (documentId) => {
    try {

      const response = await axios.post(
        `http://localhost:8080/api/files/share`,
        {
          fileId: Shareid,
          userId: "663f82c490676353a161a7e1", 
          role: userType // Assuming you have userType state variable for Editor/Viewer
        },
        config
      );
      console.log(response);
      setShowForm2(false);
      setShowForm3(false);

      axios
        .get(`http://localhost:8080/api/files/my`, config)
        .then((response) => {
          console.log("responseeeidddd==", response.data.id);
          setDocuments(response.data);



        })
        .catch((error) => {
          console.error("Errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:", error);
        });
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };


  const handleDelete = async (documentId) => {
    // Handle delete action
    try {
      await axios.delete(`http://localhost:8080/api/files/delete/${documentId}`, config);
      // If the deletion is successful, update the documents state to reflect the change
      setDocuments(documents.filter(document => document.id !== documentId));
      console.log("Document deleted successfully.");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleRename = (documentId) => {
    // Handle rename action
    setShowForm2(true);
    setNewReNameid(documentId);
  };

  const handleShare = (documentId) => {
    // Handle share action
    setShareid(documentId);
    setShowForm3(true);

  };

  const handleOpen = (documentId) => {
    navigate(`/editor/${documentId}`);
  };

  const handleCreate = async () => {
    setShowForm(true); // Show the form
  };
  const handleCloseForm = () => {
    setShowForm(false); // Close the form
    setShowForm2(false);
    setShowForm3(false);

  };

  return (
    <div className="owned-documents">
      <h2>Owned Documents</h2>
      <div className="document-list">
        {documents.map((document) => (
          <div key={document.id} className="document-block">
            <h3>{document.name}</h3>
            <div className="button-container">
              <button onClick={() => handleDelete(document.id)}>Delete</button>
              <button onClick={() => handleRename(document.id)}>Rename</button>
              <button onClick={() => handleShare(document.id)}>Share</button>
              <button onClick={() => handleOpen(document.id)}>Open</button>
            </div>
          </div>
        ))}

      </div>
      {showForm && (
        <div className="popup-form">
          <input
            type="text"
            placeholder="Enter document name"
            value={newDocumentName}
            onChange={(e) => setNewDocumentName(e.target.value)}
          />
          <button onClick={handleSubmitForm}>Create</button>
          <button onClick={handleCloseForm}>Cancel</button>
        </div>
      )}
      {showForm2 && (
        <div className="popup-form">
          <input
            type="text"
            placeholder="Enter new name"
            value={newReName}
            onChange={(e) => setNewReName(e.target.value)}
          />
          <button onClick={() => handleDoRename(document.id)}>Rename</button>
          <button onClick={handleCloseForm}>Cancel</button>
        </div>
      )}
      {showForm3 && (
        <div className="popup-form">
          <input
            type="text"
            placeholder="Enter the Username"
            value={ShareUsername}
            onChange={(e) => setShareUsername(e.target.value)}
          />
          <div>
            <label>
              <input
                type="radio"
                value="Editor"
                checked={userType === "Editor"}
                onChange={(e) => setUserType(e.target.value)}
              />
              Editor
            </label>
            <label>
              <input
                type="radio"
                value="Viewer"
                checked={userType === "Viewer"}
                onChange={(e) => setUserType(e.target.value)}
              />
              Viewer
            </label>
          </div>
          <button onClick={() => handleDoShare(document.id)}>Share</button>
          <button onClick={handleCloseForm}>Cancel</button>
        </div>
      )}

      <div>
        <button className="create-button" onClick={handleCreate}>Create Document</button>
      </div>
    </div>
  );
}

export default OwnedDocuments;
