import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import "./i18n";
import { LessonPreviewProvider } from "./context/LessonPreviewContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <LessonPreviewProvider>
        <App />
      </LessonPreviewProvider>
    </Router>
  </StrictMode>,
);
