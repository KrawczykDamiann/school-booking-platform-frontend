import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import styles from "./LoginModal.module.scss";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const { t } = useTranslation();

  // State to store the email input value
  const [email, setEmail] = useState<string>("");

  // State to manage loading spinner/disabled status during API call
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // State to handle and display any submission errors
  const [error, setError] = useState<string | null>(null);

  // State to toggle success view inside the modal
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Function to handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Sending the POST request to Kamil's backend magic-link endpoint
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/magic-link`, {
        email,
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
          <div style={{ textAlign: "center", padding: "30px 20px" }}>
            <span style={{ fontSize: "40px" }}>✉️</span>
            <h2 style={{ marginTop: "15px" }}>
              {t("login_magic_link.success_title")}
            </h2>
            <p style={{ color: "#666", marginTop: "10px" }}>
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
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <h2 className={styles.title}>{t("header.studentLogin")}</h2>
        <p className={styles.subtitle}>{t("login_magic_link.subtitle")}</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>{t("login_magic_link.label_email")}</label>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                placeholder={t("login_magic_link.placeholder_email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <label className={styles.checkboxLabel}>
            <input type="checkbox" required disabled={isLoading} />
            <span>{t("login_magic_link.ageConfirmationCheckbox")}</span>
          </label>

          {/* Displaying backend error if something goes wrong */}
          {error && (
            <p style={{ color: "#e74c3c", fontSize: "14px", margin: "10px 0" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading
              ? t("login_magic_link.button_sending")
              : t("login_magic_link.button_continue")}
          </button>
        </form>

        <div className={styles.footerNote}>
          <span className={styles.infoIcon}>ⓘ</span>{" "}
          {t("login_magic_link.footerNote")}
        </div>
      </div>
    </div>
  );
}
