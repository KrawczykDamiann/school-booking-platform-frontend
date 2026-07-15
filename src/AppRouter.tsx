import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import InstructorListPage from "./pages/InstructorListPage/InstructorListPage";
import { AdminLoginPage } from "./pages/AdminLoginPage/AdminLoginPage";
import { PasswordRecoveryPage } from "./pages/PasswordRecoveryPage/PasswordRecoveryPage";
import { AdminDashboard } from "./pages/AdminDashboard/AdminDashboard";
import { TeacherListPage } from "./pages/TeacherListPage/TeacherListPage";
// import { BookingLandingPage } from "./pages/BookingLandingPage/BookingLandingPage";
import PublicLayout from "./layouts/PublicLayout/PublicLayout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
// import { BookingLandingPage } from "./pages/BookingLandingPage/BookingLandingPage";
// import { BookingCalendar } from "./pages/BookingCalendar/BookingCalendar";
import { BookingPage } from "./pages/BookingPage/BookingPage";

export function AppRouter() {
  return (
    // <Routes>
    //   <Route path="/" element={<Navigate to="/login" replace />} />
    //   <Route path="/login" element={<LandingPage />} />
    //   <Route path="/login/admin" element={<AdminLoginPage />} />
    //   <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
    //   <Route path="/admin-dashboard" element={<AdminDashboard />} />
    //   <Route path="/instructors" element={<InstructorListPage />} />
    //   <Route path="/teachers" element={<TeacherListPage />} />
    //   <Route path="/booking" element={<BookingLandingPage />} />
    // </Routes>

    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LandingPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/instructors" element={<InstructorListPage />} />
      </Route>

      <Route path="/login/admin" element={<AdminLoginPage />} />
      <Route path="/password-recovery" element={<PasswordRecoveryPage />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="teachers" element={<TeacherListPage />} />
      </Route>
      
    </Routes>
  );
}
