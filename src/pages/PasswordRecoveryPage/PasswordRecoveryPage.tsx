import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./PasswordRecoveryPage.module.scss";
import { useState } from "react";
import emailIcon from "../../assets/email.svg";
import warningIcon from "../../assets/warning.svg";
import { validation } from "../../utils/validators";
import { Input } from "../../components/ui/Input/Input";
import { useInput } from "../../hooks/useInput";
import { ReturnIcon } from "../../components/icons/ReturnIcon";

export const PasswordRecoveryPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
            <h3 className={styles.title}>{t("passwordRecovery.success")}</h3>
            <a href="/login/admin" className={styles.emailSentLink}>
              {t("passwordRecovery.backToLogin")}
            </a>
          </div>
        ) : (
          <>
            <div className={styles.headerWrapper}>
              <div className={styles.header}>
                <button
                  onClick={() => navigate("/login/admin")}
                  className={styles.buttonBack}
                >
                  <ReturnIcon />
                </button>
                <h3 className={styles.title}>{t("passwordRecovery.title")}</h3>
              </div>
              <p className={styles.text}>{t("passwordRecovery.description")}</p>
            </div>
            <form
              onSubmit={handleSubmit}
              className={styles.form}
              id="recovery-password"
            >
              <div className={styles.inputsContainer}>
                <Input
                  label={t("passwordRecovery.emailLabel")}
                  type="email"
                  placeholder={t("passwordRecovery.emailPlaceholder")}
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
                <p className={styles.text}>{t("passwordRecovery.info")}</p>
              </div>
            </form>
            <button
              type="submit"
              className={styles.button}
              form="recovery-password"
              disabled={!emailInput.isValid}
            >
              {t("passwordRecovery.submit")}
            </button>
          </>
        )}
      </div>
      <div>Language Switcher (coming soon)</div>
    </div>
  );
};
