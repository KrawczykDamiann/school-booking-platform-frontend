import styles from "./PasswordRecoveryForm.module.scss";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useInput } from "../../hooks/useInput";
import { useState } from "react";
import { validation } from "../../utils/validators";
import { Input } from "../../components/ui/Input/Input";
import { ReturnIcon } from "../../components/icons/ReturnIcon";
import { Button } from "../../components/ui/Button/Button";
import emailIcon from "../../assets/email.svg";
import warningIcon from "../../assets/warning.svg";

export const PasswordRecoveryForm: React.FC = () => {
  const location = useLocation();
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
    <div className={styles.passwordRecoveryForm}>
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
              <Link to="/login/admin" className={styles.returnLink}>
                <ReturnIcon size={24} className={styles.returnLinkIcon}/>
              </Link>
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
          <div className={styles.buttonWrapper}>
            <Button
              variant="primary"
              type="submit"
              form="recovery-password"
              disabled={!emailInput.isValid}
            >
              {t("passwordRecovery.submit")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
