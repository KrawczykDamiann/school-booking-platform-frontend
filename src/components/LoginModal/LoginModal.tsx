import { useState } from "react";
import axios from "axios";
import styles from "./LoginModal.module.scss";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  // State to store the email input value
  const [email, setEmail] = useState<string>(" ");
  
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
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
        
        <h2 className={styles.title}>Student login</h2>
        <p className={styles.subtitle}>Please provide information about you</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Contact</label>
            <div className={styles.inputWrapper}>
              <input 
                type="email" 
                placeholder="studentemail@gmail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                disabled={isLoading}
              />
            </div>
          </div>

          <label className={styles.checkboxLabel}>
            <input type="checkbox" required disabled={isLoading} />
            <span>I confirm that I'm over 16 years old.</span>
          </label>

          {/* Displaying backend error if something goes wrong */}
          {error && <p className={styles.errorMessage}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? "Sending..." : "Confirm"}
          </button>
        </form>

        <div className={styles.footerNote}>
          <span className={styles.infoIcon}>ⓘ</span> We will send you a magic link to confirm your email
        </div>
      </div>
    </div>
  );
}