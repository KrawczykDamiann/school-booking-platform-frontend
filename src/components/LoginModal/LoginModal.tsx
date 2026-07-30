import { useState } from "react";
import axios from "axios";
import styles from "./LoginModal.module.scss";
import { Input } from "../ui/Input/Input";
import { Checkbox } from "../ui/Checkbox/Checkbox";
import emailIcon from "../../assets/email.svg";
import warningIcon from "../../assets/warning.svg";
import { validation } from "../../utils/validators";
import { useInput } from "../../hooks/useInput";
import { requestStudentOtt } from "../../api/auth";
import { Button } from "../ui/Button/Button";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
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

    const error = validation.validateEmail(email);

    if (error) {
      emailInput.setError(error);
      return;
    }

    if (!hasConfirmedAge) {
      setError("Please confirm that you are at least 16 years old.");
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
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 500) {
          setError("Server error");
          return;
        }
      }

      setError("Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  // If the email was successfully sent, display the success message
  if (isSubmitted) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.submitModalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.title}>Check your email!</h2>
              <button className={styles.closeBtn} onClick={onClose}>
                ✕
              </button>
            </div>
            <div className={styles.successContent}>
              <p className={styles.successText}>
                We have sent a magic link to:
                <strong>{email}</strong>.
              </p>
              <div className={styles.buttonWrapper}>
                <Button type="button" variant="primary" onClick={onClose}>
                  Understood
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Student login</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        <p className={styles.subtitle}>Please provide information about you</p>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
          id="student-login-form"
        >
          <Input
            label="Contact"
            type="email"
            placeholder="studentemail@gmail.com"
            value={email}
            onChange={emailInput.onChange}
            onBlur={emailInput.onBlur}
            required
            disabled={isLoading}
            error={emailInput.error}
            leftIcon={emailIcon}
          />

          <Checkbox
            label="I confirm that I’m over 16 years old."
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
          {isLoading ? "Sending..." : "Confirm"}
        </button>

        <div className={styles.footerNote}>
          <img
            src={warningIcon}
            alt="Warning icon"
            className={styles.infoIcon}
          />
          We will send you a magic link to confirm your email
        </div>
      </div>
    </div>
  );
}
