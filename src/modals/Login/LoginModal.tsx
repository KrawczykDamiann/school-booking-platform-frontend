import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./LoginModal.module.scss";
import { useInput } from "../../hooks/useInput";
import { validation } from "../../utils/validators";
import { requestStudentOtt } from "../../api/auth";
import { authStorage } from "../../services/authStorage";
import { Input } from "../../components/ui/Input/Input";
import { Checkbox } from "../../components/ui/Checkbox/Checkbox";
import emailIcon from "../../assets/email.svg";
import warningIcon from "../../assets/warning.svg";
import infoIcon from "../../assets/info-circle.svg";
import { Button } from "../../components/ui/Button/Button";

type LoginModalProps = {
  onClose: () => void;
};

export const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const { t } = useTranslation();

  // State to store the email input value
  const emailInput = useInput({ validator: validation.validateEmail });
  const email = emailInput.value;

  // State to manage loading spinner/disabled status during API call
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // State to handle and display any submission errors
  const [hasConfirmedAge, setHasConfirmedAge] = useState<boolean>(false);

  // State for server error and hasConfirmedAge error
  const [error, setError] = useState<string | null>("");

  // State to toggle success view inside the modal
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Function to handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const error = validation.validateEmail(email);

    if (error) {
      emailInput.setError(error);
      return;
    }

    if (!hasConfirmedAge) {
      setError(t("login_magic_link.ageConfirmation"));
      return;
    }

    try {
      const zoneId = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const response = await requestStudentOtt({
        email,
        zoneId,
      });

      if (response.status === "SENT") {
        authStorage.setPendingEmail(response.recipient);
      }

      // If successful, switch to the success confirmation view
      setIsSubmitted(true);
    } catch (err) {
      console.error("API Error:", err);
      setError(t("login_magic_link.error_generic"));
    } finally {
      setIsLoading(false);
    }
  };

  // If the email was successfully sent, display the success message
  if (isSubmitted) {
    return (
      <div className={styles.successContent}>
        <img src={infoIcon} alt="Info icon" className={styles.successIcon} />
        <h2 className={styles.successTitle}>
          {t("login_magic_link.success_title")}
        </h2>
        <p className={styles.successText}>
          {t("login_magic_link.success_text_start")} <span>{email}</span>
        </p>
        <div className={styles.successButtonWrapper}>
          <Button variant="primary" theme="info" onClick={onClose}>
            Ok
          </Button>
        </div>

        <div className={styles.successFooter}>
          <img
            src={warningIcon}
            alt={t("login_magic_link.warningIconAlt")}
            className={styles.infoIcon}
          />
          <p className={styles.successText}>
            {t("login_magic_link.success_text_end")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.modalHeader}>
        <h2 className={styles.title}>{t("login_magic_link.title")}</h2>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>
      <p className={styles.subtitle}>{t("login_magic_link.subtitle")}</p>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
        id="student-login-form"
      >
        <Input
          label={t("login_magic_link.label_email")}
          type="email"
          placeholder={t("login_magic_link.placeholder_email")}
          value={email}
          onChange={emailInput.onChange}
          onBlur={emailInput.onBlur}
          required
          disabled={isLoading}
          error={emailInput.error}
          leftIcon={emailIcon}
        />

        <Checkbox
          label={t("login_magic_link.ageConfirmationCheckbox")}
          checked={hasConfirmedAge}
          onChange={(e) => setHasConfirmedAge(e.target.checked)}
          error={error}
        />

        {error && <p className={styles.errorMessage}>{error}</p>}
      </form>

      <div className={styles.buttonWrapper}>
        <Button
          variant="primary"
          type="submit"
          form="student-login-form"
          disabled={isLoading}
        >
          {isLoading
            ? t("login_magic_link.button_sending")
            : t("login_magic_link.button_continue")}
        </Button>
      </div>

      <div className={styles.footerNote}>
        <img
          src={warningIcon}
          alt={t("login_magic_link.warningIconAlt")}
          className={styles.infoIcon}
        />
        {t("login_magic_link.footerNote")}
      </div>
    </>
  );
};
