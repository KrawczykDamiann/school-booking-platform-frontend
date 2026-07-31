import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import InstructorListPage from "./pages/InstructorListPage/InstructorListPage";
import { AdminLoginPage } from "./pages/AdminLoginPage/AdminLoginPage";
import { PasswordRecoveryPage } from "./pages/PasswordRecoveryPage/PasswordRecoveryPage";
import { AdminDashboard } from "./pages/AdminDashboard/AdminDashboard";
import { TeacherListPage } from "./pages/TeacherListPage/TeacherListPage";
import PublicLayout from "./layouts/PublicLayout/PublicLayout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import { BookingPage } from "./pages/BookingPage/BookingPage";
import { ProtectedRoute } from "./features/ProtectedRoute/ProtectedRoute";
import { OttVerificationPage } from "./pages/OttVerificationPage/OttVerificationPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LandingPage />} />
        <Route path="/login/admin" element={<AdminLoginPage />} />
        <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
        {/* <Route path="/booking" element={<BookingLandingPage />} /> */}
        <Route path="/instructors" element={<InstructorListPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="teachers" element={<TeacherListPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
