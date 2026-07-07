import { Routes, Route, Navigate } from "react-router-dom";
// Importujemy nasze dwa nowe, jasne widoki:
import LandingPage from "./pages/LandingPage/LandingPage";
import InstructorListPage from "./pages/InstructorListPage/InstructorListPage";
import { AdminLoginPage } from "./pages/AdminLoginPage/AdminLoginPage";
import { PasswordRecoveryPage } from "./pages/PasswordRecoveryPage/PasswordRecoveryPage";
import { AdminDashboard } from "./pages/AdminDashboard/AdminDashboard";

function App() {
  return (
    <Routes>
      {/* Jeśli użytkownik wejdzie na czysty adres, przekierowujemy go na /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Nasz nowy Landing Page z modalem obsługuje adres /login */}
      <Route path="/login" element={<LandingPage />} />

      <Route path="/login/admin" element={<AdminLoginPage />} />

      <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
      
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      
      {/* Nowa tablica nauczycieli dostępna pod adresem /instructors */}
      <Route path="/instructors" element={<InstructorListPage />} />
    </Routes>
  );
}

export default App;