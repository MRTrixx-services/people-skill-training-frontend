import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";
import { ToastProvider } from "contexts/ToastContext";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ToastProvider>
    <App />
  </ToastProvider>
);
