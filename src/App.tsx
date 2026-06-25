import { Routes, Route, Navigate } from "react-router-dom";
import styles from "./App.module.scss";
import { LanguageSwitcher } from "./components/LanguageSwitcher/LanguageSwitcher"; 
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { InstructorListPage } from "./pages/InstructorListPage/InstructorListPage";
import { AuthCallback } from "./pages/AuthCallback/AuthCallback";
import calendarIcon from "./components/icons/calendar.png"; 

function App() {
  return (
    <div className={styles.appContainer}>
      <header className={styles.appHeader}>
        
        {/* Interactive student schedule shortcut link */}
        <div className={styles.calendarIconWrapper}>
          <img src={calendarIcon} alt="Student Calendar" />
          <span className={styles.badge}>3</span>
        </div>

        <LanguageSwitcher />
        
      </header>

      <main className={styles.appMain}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/instructors" element={<InstructorListPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;