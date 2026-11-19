// Import StrictMode so React warns about unsafe patterns during development.
import { StrictMode } from "react";
// Import createRoot, the React 19 entry point for rendering into the DOM.
import { createRoot } from "react-dom/client";
// Import the global stylesheet for the application.
import "./index.css";
// Import the root component that contains the providers and layout.
import App from "./App.jsx";

// Mount the application into the #root element defined in index.html.
createRoot(document.getElementById("root")).render(
  // StrictMode double-invokes effects in development to surface side effects.
  <StrictMode>
    <App />
  </StrictMode>
);
