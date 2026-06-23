import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { InstructorListPage } from "./pages/InstructorListPage/InstructorListPage";
import { LanguageSwitcher } from "./components/LanguageSwitcher/LanguageSwitcher";
import "./App.scss";

function App() {
  return (
    <div className="app-container">
      {/* Application header containing the dropdown language switcher at the top */}
      <header className="app-header">
        <LanguageSwitcher />
      </header>

      {/* Main content area for rendering application pages */}
      <main className="app-main">
        <Routes>
          {/* Przekierowanie ze strony głównej "/" bezpośrednio na logowanie */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Ekran logowania dostępny pod adresem: /login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Katalog instruktorów dostępny pod adresem: /instructors */}
          <Route path="/instructors" element={<InstructorListPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;