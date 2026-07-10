import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import InstructorListPage from "./pages/InstructorListPage/InstructorListPage";
import { AdminLoginPage } from "./pages/AdminLoginPage/AdminLoginPage";
import { PasswordRecoveryPage } from "./pages/PasswordRecoveryPage/PasswordRecoveryPage";
import { AdminDashboard } from "./pages/AdminDashboard/AdminDashboard";
import { TeacherListPage } from './pages/TeacherListPage/TeacherListPage';
// 1. Add import for the new booking page
import { BookingLandingPage } from './pages/BookingLandingPage/BookingLandingPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LandingPage />} />
      <Route path="/login/admin" element={<AdminLoginPage />} />
      <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/instructors" element={<InstructorListPage />} />
      <Route path="/teachers" element={<TeacherListPage />} />
      
      {/* 2. Add route for the booking landing page */}
      <Route path="/booking" element={<BookingLandingPage />} />
    </Routes>
  );
}

export default App;
