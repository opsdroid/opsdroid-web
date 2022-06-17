import React from "react";

import "./styles/index.scss";
import { Prompt } from "./components/Prompt";
import { Conversation } from "./components/Conversation";
import { UpdateMessage } from "./components/updateMessage";
import { NavBar } from "./components/Navbar";
import { Settings } from "./components/Settings";

function App() {
  return (
    <div className="App">
      <NavBar />
      <UpdateMessage />
      <Settings />
      <Conversation />
      <Prompt />
    </div>
  );
}

export default App;
