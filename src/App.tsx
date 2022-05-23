import React from "react";
// import "./App.css";
import "./styles/index.scss";
import { ConnectionSettings } from "./components/ConnectionSettings";
import { Prompt } from "./components/Prompt";
import { Conversation } from "./components/Conversation";

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <ConnectionSettings />
      <Conversation />
      <Prompt />
    </div>
  );
}

export default App;
