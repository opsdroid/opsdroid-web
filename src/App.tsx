import React from "react";

import "./styles/index.css";
import { Prompt } from "./components/Prompt";
import { Conversation } from "./components/Conversation";
import { UpdateMessage } from "./components/updateMessage";
import { NavBar } from "./components/Navbar";
import { Settings } from "./components/Settings";
import { getTheme } from "./theme";

function App() {
  const theme = getTheme();
  React.useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, []);

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
