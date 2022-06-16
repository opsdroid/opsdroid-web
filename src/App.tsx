import React from "react";

import "./styles/index.scss";
import { ConnectionSettings } from "./components/ConnectionSettings";
import { Prompt } from "./components/Prompt";
import { Conversation } from "./components/Conversation";
import { UpdateMessage } from "./components/updateMessage";
import { NavBar } from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <NavBar />
      <UpdateMessage />
      <ConnectionSettings />
      <Conversation />
      <Prompt />
    </div>
  );
}

export default App;
