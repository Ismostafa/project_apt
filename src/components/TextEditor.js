import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom'; // Import useLocation
import './TextEditor.css';
import Cookies from 'js-cookie';
import { Client } from '@stomp/stompjs'; // Import STOMP Client

const TextEditor = () => {
  const { id } = useParams();
  const { state } = useLocation(); // Get state from location
  const { role } = state || { role: 'Viewer' }; // Default to 'Viewer' if role is not provided
  const [documentContent, setDocumentContent] = useState('');
  const token = Cookies.get("token");
  const [socket, setSocket] = useState(null);
  const [stompClient, setStompClient] = useState(null);

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

    // Initialize STOMP client
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      onConnect: () => {
        console.log('Connected to WebSocket');
        client.subscribe(`/topic/documents/${id}`, (message) => {
          const data = JSON.parse(message.body);
          setDocumentContent(data.content);
        });
        const initialData = { documentId: id, content: '' };
        client.publish({ destination: `/app/documents/${id}`, body: JSON.stringify(initialData) });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    client.activate();
    setStompClient(client);

    // Clean up WebSocket connection on component unmount
    return () => {
      if (client) {
        client.deactivate();
      }
    };
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
      {role === 'Viewer' && (
        <div className="view-only-notice">
          This document is read-only.
        </div>
      )}
      <div className="toolbar">
        <button onClick={handleBoldClick} disabled={role === 'Viewer'}>Bold</button>
        <button onClick={handleItalicClick} disabled={role === 'Viewer'}>Italic</button>
        <button onClick={handleSave} disabled={role === 'Viewer'}>Save</button>
      </div>
      <div
        className="editable-content"
        contentEditable={role !== 'Viewer'}
        dangerouslySetInnerHTML={{ __html: documentContent }}
      />
    </div>
  );
};

export default TextEditor;
