/* global google */
import React, { useState, useRef, useEffect } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";



import routes from "./components/routes";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          {Object.entries(routes).map(([path, element]) => (
            <Route key={path} path={path} element={element()} />
          ))}
        </Routes>
      </BrowserRouter>
  );
}

export default App;
