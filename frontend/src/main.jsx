import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { XpProvider } from "./XPContext.jsx"; 
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <XpProvider>
    <App />
    </XpProvider>
  </React.StrictMode>
);