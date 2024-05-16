import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import Header from "./Header.js";
import OwnedDocuments from "./OwnedDocuments.js";
import SharedEditer from "./SharedEditer.js";
import "./Nav.css"
// import './Header.css';
function Nav() {
  const [activeNavItem, setActiveNavItem] = useState(0);
const username=localStorage.getItem('username');
  const handleTabChange = (event, newValue) => {
    setActiveNavItem(newValue);
  };
  return (
    <>
      <Header />


      <div>
        <div className="draft">
          <h1 className="title" >Welcome: {username}</h1>
          <div class="horizontalLine"></div>
         
        </div>
      </div>

      <Tabs
        className="navListsizeLg"
        value={activeNavItem}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        left
      >
        <Tab
          label="owned documents"
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "var(--font-medium)",
            "&:hover": { color: "var(--color-black)" },
          }}
        />
        <Tab
          label="shared documents"
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "var(--font-medium)",
            "&:hover": { color: "var(--color-black)" },
          }}
        />

      </Tabs>

      {activeNavItem === 0 && <OwnedDocuments />}
      {activeNavItem === 1 && < SharedEditer/>}





    </>
  );
}

export default Nav;
