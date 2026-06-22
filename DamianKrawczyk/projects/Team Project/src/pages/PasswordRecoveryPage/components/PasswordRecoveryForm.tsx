import { useState } from "react";
import styles from "../PasswordRecoveryPage.module.scss";
import { validation } from "../../../utils/validators";

type Props = {
    onSuccess: () => void;
}

export const PasswordRecoveryForm: React.FC<Props> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    if (emailError) {
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

    onSuccess();
  };

  return (
    <div>
      <h4 className={styles.subtitle}>Enter your email</h4>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputField}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="admin@email.rom"
            className={`${styles.input} ${emailError && styles.inputError}`}
            value={email}
            onChange={(e) => handleEmailChange(e)}
          />
          {emailError && <span className={styles.error}>{emailError}</span>}
          <p className={styles.text}>
            We will send a recovery magic link to the email you have entered
          </p>
        </div>
        <button type="submit" className={styles.button}>
          Get a link
        </button>
      </form>
    </div>
  );
};
