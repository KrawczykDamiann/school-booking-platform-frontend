import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import "./i18n";
import { LessonPreviewProvider } from "./context/LessonPreviewContext.tsx";
import { AuthContextProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <Router>
    <AuthContextProvider>
      <LessonPreviewProvider>
        <App />
      </LessonPreviewProvider>
    </AuthContextProvider>
  </Router>
);
