import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './TextEditor.css';
import Cookies from 'js-cookie';

const TextEditor = () => {
  const { id } = useParams();
  const [documentContent, setDocumentContent] = useState('');
  const token = Cookies.get("token");
  const [socket, setSocket] = useState(null);

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/files/${id}`, config)
      .then((response) => {
        setDocumentContent(response.data.content);
      })
      .catch((error) => {
        console.error("Error fetching document:", error);
      });

    // Initialize WebSocket connection
    const socket = new WebSocket(`ws://localhost:8080/api/topic`);

    socket.onopen = () => {
      console.log("WebSocket connected");
      const data = { documentId: id , content: "" };
      const jsonData = JSON.stringify(data);
      socket.send(jsonData);
    };
    
    socket.onmessage = (event) => {
      console.log("Received message:", event.data);
      setDocumentContent(event.data.content);
    };
    
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    
    socket.onclose = (event) => {
      console.log("WebSocket closed:", event);
    };
    
    setSocket(socket);
  }, [id]);
  const handleBoldClick = () => {
    document.execCommand('bold', false, '');
  };

  const handleItalicClick = () => {
    document.execCommand('italic', false, '');
  };

  const handleSave = () => {
    const content = document.querySelector('.editable-content').innerHTML;
    axios
      .post(
        `http://localhost:8080/api/files/${id}`,
        { content },
        config
      )
      .then((response) => {
        console.log("Document saved:", response.data);
      })
      .catch((error) => {
        console.error("Error saving document:", error);
      });
  };

  return (
    <div className="text-editor">
      <div className="toolbar">
        <button onClick={handleBoldClick}>Bold</button>
        <button onClick={handleItalicClick}>Italic</button>
        <button onClick={handleSave}>Save</button>
      </div>
      <div
        className="editable-content"
        contentEditable="true"
        dangerouslySetInnerHTML={{ __html: documentContent }}
      />
    </div>
  );
};

export default TextEditor;
