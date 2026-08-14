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
import { OttVerificationPage } from "./pages/OttVerificationPage/OttVerificationPage";
import { BookingLesson } from "./features/bookingLesson/BookingLesson";
import { AdminSetupController } from "./features/AdminSetupController/AdminSetupController";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LandingPage />} />
        <Route path="/login/link" element={<OttVerificationPage />} />
        <Route path="/login/admin" element={<AdminLoginPage />} />
        <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
        <Route path="/booking-calendar" element={<BookingPage />} />
        {/* <Route path="/booking" element={<BookingLandingPage />} /> */}
        <Route path="/instructors" element={<InstructorListPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="teachers" element={<TeacherListPage />} />
        <Route path="create-booking" element={<BookingLesson />} />
        <Route path="setup-controller" element={<AdminSetupController />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
