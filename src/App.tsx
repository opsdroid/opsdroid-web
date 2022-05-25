import React from "react";
// import "./App.css";
import "./styles/index.scss";
import { ConnectionSettings } from "./components/ConnectionSettings";
import { Prompt } from "./components/Prompt";
import { Conversation } from "./components/Conversation";
import { UpdateMessage } from "./components/updateMessage";

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <UpdateMessage />
      <ConnectionSettings />
      <Conversation />
      <Prompt />
    </div>
  );
}

export default App;
