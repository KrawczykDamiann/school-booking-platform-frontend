import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./LoginModal.module.scss";
import { Input } from "../ui/Input/Input";
import { Checkbox } from "../ui/Checkbox/Checkbox";
import emailIcon from "../../assets/email.svg";
import warningIcon from "../../assets/warning.svg";
import { validation } from "../../utils/validators";
import { useInput } from "../../hooks/useInput";
import { requestStudentOtt } from "../../api/auth";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
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

      await requestStudentOtt({
        email,
        zoneId,
      });

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
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
          <div className={styles.successContent}>
            <span className={styles.successIcon}>✉️</span>
            <h2 className={styles.successTitle}>
              {t("login_magic_link.success_title")}
            </h2>
            <p className={styles.successText}>
              {t("login_magic_link.success_text_start")}
              <strong>{email}</strong>
              {t("login_magic_link.success_text_end")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>{t("header.studentLogin")}</h2>
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

        <button
          type="submit"
          form="student-login-form"
          className={styles.submitBtn}
          disabled={isLoading}
        >
          {isLoading
            ? t("login_magic_link.button_sending")
            : t("login_magic_link.button_continue")}
        </button>

        <div className={styles.footerNote}>
          <img
            src={warningIcon}
            alt={t("login_magic_link.warningIconAlt")}
            className={styles.infoIcon}
          />
          {t("login_magic_link.footerNote")}
        </div>
      </div>
    </div>
  );
}
