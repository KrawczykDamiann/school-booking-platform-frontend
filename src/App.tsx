import React from "react";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { InstructorListPage } from "./pages/InstructorListPage/InstructorListPage";

function App() {
  return (
    <>
      {/* Rendering your new Magic Link login page */}
      <LoginPage />
      {/* Rendering the Instructor List Page */}
      <InstructorListPage />
    </>
  );
}

export default App;
