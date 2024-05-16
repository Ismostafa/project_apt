import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import './TextEditor.css';
import Cookies from 'js-cookie';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const TextEditor = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const { role } = state || { role: 'Viewer' };
  const [documentContent, setDocumentContent] = useState('');
  const token = Cookies.get("token");
  const stompClientRef = useRef(null);
  const contentRef = useRef(null);

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

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    client.onConnect = (frame) => {
      console.log('Connected:', frame);

      client.subscribe('/topic/updates', (message) => {
        const updatedContent = JSON.parse(message.body);
        setDocumentContent(updatedContent.content);
        console.log('Received message:', message.body);
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP Error:', frame);
    };

    client.onWebSocketClose = () => {
      console.log('WebSocket closed');
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [id, token]);

  const handleBoldClick = () => {
    document.execCommand('bold', false, '');
  };
  
  const handleItalicClick = () => {
    document.execCommand('italic', false, '');
  };
  

  const handleSave = () => {
    const content = contentRef.current.innerHTML;
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

  const sendUpdate = (content) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: '/app/edit',
        body: JSON.stringify({ content }),
      });
    }
  };

  const saveCaretPosition = () => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(contentRef.current);
    preCaretRange.setEnd(range.startContainer, range.startOffset);
    return preCaretRange.toString().length;
  };

  const restoreCaretPosition = (position) => {
    const selection = window.getSelection();
    const range = document.createRange();
    let offset = 0;

    const setPosition = (node) => {
      if (node.nodeType === 3) {
        const length = node.length;
        if (offset + length >= position) {
          range.setStart(node, position - offset);
          range.collapse(true);
          return true;
        }
        offset += length;
      } else {
        for (let i = 0; i < node.childNodes.length; i++) {
          if (setPosition(node.childNodes[i])) return true;
        }
      }
      return false;
    };

    setPosition(contentRef.current);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const handleContentChange = (event) => {
    const content = event.target.innerHTML;
    const caretPosition = saveCaretPosition();
    setDocumentContent(content);
  
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default behavior (line break)
  
      // Get the current selection
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
  
      // Create a new <u> (underline) element
      const uElement = document.createElement('u');
      uElement.innerHTML = '&#8203;'; // Zero-width space to ensure the <u> tag is not collapsed
  
      // Insert the <u> element at the current caret position
      range.insertNode(uElement);
  
      // Move the caret to the end of the inserted <u> element
      range.setStartAfter(uElement);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  
    sendUpdate(content);
    setTimeout(() => restoreCaretPosition(caretPosition), 0);
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
        ref={contentRef}
        onInput={handleContentChange}
        dangerouslySetInnerHTML={{ __html: documentContent }}
      />
    </div>
  );
};

export default TextEditor;
