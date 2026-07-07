import { useState } from "react";
import axios from "axios";
import styles from "./LoginModal.module.scss";
import { Input } from "../ui/Input/Input";
import { Checkbox } from "../ui/Checkbox/Checkbox";
import emailIcon from "../../assets/email.svg";
import warningIcon from "../../assets/warning.svg";
import { validation } from "../../utils/validators";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  // State to store the email input value
  const [email, setEmail] = useState<string>(" ");

  // State to manage loading spinner/disabled status during API call
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // State to handle and display any submission errors
  const [hasConfirmedAge, setHasConfirmedAge] = useState<boolean>(false);

  // State for server error and hasConfirmedAge error
  const [error, setError] = useState<string | null>(null);

  const [emailError, setEmailError] = useState("");

  // State to toggle success view inside the modal
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    if (emailError) {
      setEmailError("");
    }
  };

  // Regexp that checks email validity
  const emailPattern = validation.emailPattern;

  const handleEmailBlur = () => {
    if (!email) {
      return;
    }

    if (!emailPattern.test(email)) {
      setEmailError("Wrong email format");
    } else {
      setEmailError("");
    }
  };

  // Function to handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hasConfirmedAge) {
      setError("Please confirm that you are at least 16 years old.");
      return;
    }

    try {
      // Sending the POST request to Kamil's backend magic-link endpoint
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/magic-link`, {
        email,
      });

      // If successful, switch to the success confirmation view
      setIsSubmitted(true);
    } catch (err) {
      console.error("API Error:", err);
      setError("Something went wrong. Please try again.");
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
            <h2 className={styles.successTitle}>Check your email!</h2>
            <p className={styles.successText}>
              We have sent a magic link to <strong>{email}</strong>.
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
            onChange={(e) => handleEmailChange(e)}
            onBlur={handleEmailBlur}
            required
            disabled={isLoading}
            error={emailError}
            leftIcon={emailIcon}
          />

          <Checkbox
            label="I confirm that I’m over 16 years old."
            checked={hasConfirmedAge}
            onChange={(e) => setHasConfirmedAge(e.target.checked)}
            error={error}
          />

          {/* Displaying backend error if something goes wrong */}
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
