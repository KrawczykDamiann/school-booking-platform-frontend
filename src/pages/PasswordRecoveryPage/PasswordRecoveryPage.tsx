import { useLocation, useNavigate } from "react-router-dom";
import styles from "./PasswordRecoveryPage.module.scss";
import { useState } from "react";
import returnIcon from "../../assets/return.svg";
import emailIcon from "../../assets/email.svg";
import warningIcon from "../../assets/warning.svg";
import { validation } from "../../utils/validators";
import { Input } from "../../components/ui/Input/Input";
import { useInput } from "../../hooks/useInput";

export const PasswordRecoveryPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const emailInput = useInput({
    initialValue: location.state?.email ?? "",
    validator: validation.validateEmail,
  });

  const email = emailInput.value;

  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = (event: React.SubmitEvent) => {
    event.preventDefault();

    const error = validation.validateEmail(email);

    if (error) {
      emailInput.setError(error);
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
          <div className={styles.emailSent}>
            <h3 className={styles.title}>
              If account exists, it will receive a recovery link
            </h3>
            <a href="/login/admin" className={styles.emailSentLink}>Back to login</a>
          </div>
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
                <Input
                  label="Email"
                  type="email"
                  placeholder="admin@email.com"
                  value={email}
                  onChange={emailInput.onChange}
                  onBlur={emailInput.onBlur}
                  required
                  error={emailInput.error}
                  leftIcon={emailIcon}
                />
              </div>
              <div className={styles.infoContainer}>
                <img
                  src={warningIcon}
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
              disabled={!emailInput.isValid}
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
