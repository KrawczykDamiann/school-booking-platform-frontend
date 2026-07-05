import { useLocation, useNavigate } from "react-router-dom";
import styles from "./PasswordRecoveryPage.module.scss";
import { useState } from "react";
import returnIcon from "../../assets/return.svg";
import emailIcon from "../../assets/email.svg";
import infoIcon from "../../assets/info.svg";
import { validation } from "../../utils/validators";

export const PasswordRecoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const [isEmailSent, setIsEmailSent] = useState(false);

  const { state } = useLocation();

  const [email, setEmail] = useState(state?.email ?? "");
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    if (emailError) {
      setEmailError("");
    }
  };

  const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

  const isButtonDisabled = !email || !emailPattern.test(email);

  const handleEmailBlur = () => {
    if (!email) {
      return;
    }

    if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = (event: React.SubmitEvent) => {
    event.preventDefault();

    const error = validation.email(email);

    if (error) {
      setEmailError(error);
      return;
    }

    // API request

    setIsEmailSent(true);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.layout}>
        <span className={styles.layoutTitle}>Lessio</span>
      </div>
      <div className={styles.formWrapper}>
        {isEmailSent ? (
          <h3 className={styles.title}>If account exists, it will receive a recovery link</h3>
        ) : (
          <>
            <div className={styles.headerWrapper}>
              <div className={styles.header}>
                <button
                  onClick={() => navigate("/login/admin")}
                  className={styles.buttonBack}
                >
                  <img
                    src={returnIcon}
                    alt="Return icon"
                    className={styles.buttonIcon}
                  />
                </button>
                <h3 className={styles.title}>Forgot your password?</h3>
              </div>
              <p className={styles.text}>
                Enter your email to request recovery
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className={styles.form}
              id="recovery-password"
            >
              <div className={styles.inputsContainer}>
                <div className={styles.inputField}>
                  <label
                    htmlFor="email"
                    className={`${styles.label} ${emailError ? styles.labelError : ""}`}
                  >
                    Email*
                  </label>
                  <img
                    src={emailIcon}
                    alt="Email icon"
                    className={styles.icon}
                  />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="admin@email.com"
                    className={`${styles.input} ${emailError && styles.inputError}`}
                    value={email}
                    onChange={(e) => handleEmailChange(e)}
                    onBlur={handleEmailBlur}
                  />
                  {emailError && (
                    <span className={styles.error}>{emailError}</span>
                  )}
                </div>
              </div>
              <div className={styles.infoContainer}>
                <img
                  src={infoIcon}
                  alt="Info icon"
                  className={styles.iconInfo}
                />
                <p className={styles.text}>
                  We will send a recovery link to your email
                </p>
              </div>
            </form>
            <button
              type="submit"
              className={styles.button}
              form="recovery-password"
              disabled={isButtonDisabled}
            >
              Request recovery
            </button>
          </>
        )}
      </div>
      <div>Language Switcher (coming soon)</div>
    </div>
  );
};
