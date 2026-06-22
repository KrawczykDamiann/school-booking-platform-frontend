import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard/AdminDashboard';
import { PasswordRecoveryPage } from './pages/PasswordRecoveryPage/PasswordRecoveryPage';

function App() {
  return (
    <>
      {/* Rendering your new Magic Link login page */}
      <Routes>
        <Route path="/authorization" element={<LoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
      </Routes>
    </>
  );
}

export default App;