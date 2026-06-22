import React from "react";
import { RequestMagicLinkForm } from "../../features/auth/RequestMagicLinkForm";
import { AuthForm } from "../../features/AuthForm/AuthForm";

export const LoginPage: React.FC = () => {
  return (
    <div
      className="login-page-wrapper"
      style={{
        minHeight: "100vh",
        backgroundColor: "#E9E9E9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Rendering the modular magic link form inside the login page */}
      {/* <RequestMagicLinkForm /> */}
      <AuthForm />
    </div>
  );
};
