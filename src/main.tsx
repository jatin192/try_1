import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AnonAadhaarContext } from "./context/AnonAadhaarContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AnonAadhaarContext>
      <App />
    </AnonAadhaarContext>
  </StrictMode>
);
