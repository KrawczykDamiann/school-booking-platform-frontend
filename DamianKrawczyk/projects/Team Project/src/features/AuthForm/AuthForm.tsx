import { useState } from "react";
import styles from "./AuthForm.module.scss";
import { SignInForm } from "./SignInForm";
import { SignUpFlow } from "./SignUp/SignUpFlow";

type AuthMode = "signin" | "signup";
type SignUpStep = "account" | "password";

export const AuthForm: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>("signin");

  const [signUpStep, setSignUpStep] = useState<SignUpStep>("account");

  const showHeader =
    authMode === "signin" ||
    (authMode === "signup" && signUpStep === "account");

  return (
    <div className={styles.wrapper}>
      {showHeader && (
        <>
          <div>
            <button
              onClick={() => setAuthMode("signin")}
              className={`${styles.switchButton} ${authMode === "signin" ? styles.switchButtonActive : ""}`}
            >
              SIGN IN
            </button>
            <button
              onClick={() => setAuthMode("signup")}
              className={`${styles.switchButton} ${authMode === "signup" ? styles.switchButtonActive : ""}`}
            >
              SIGN UP
            </button>
          </div>
          <h3 className={styles.title}>
            {authMode === "signin"
              ? "Sign into your account"
              : "Create an account"}
          </h3>
        </>
      )}

      <div className={styles.formWrapper}>
        {authMode === "signin" ? (
          <SignInForm />
        ) : (
          <SignUpFlow step={signUpStep} setStep={setSignUpStep} />
        )}
      </div>
    </div>
  );
};
