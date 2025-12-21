import React from "react";
import ReactDOM from "react-dom/client";
import Dashboard from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import "../resources/css/app.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
