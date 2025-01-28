import "./index.css";

import { createRoot } from "react-dom/client";
import { App } from "./App";

// Get the root element
const rootElement = document.getElementById("root");

// Check if rootElement is not null
if (!rootElement) {
  throw new Error(
    "Root element with id 'root' not found. Please check your index.html file."
  );
}

// Create and render the root
const root = createRoot(rootElement);
root.render(<App />);
