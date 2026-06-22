import { useState } from "react";
import styles from "../AuthForm.module.scss";
import eyeOffIcon from "../../../assets/EyeOffIcon.svg";
import eyeIcon from "../../../assets/EyeIcon.svg";
import { useNavigate } from "react-router-dom";

type Props = {
    onBack: () => void;
}

export const PasswordSetupForm: React.FC<Props> = ({ onBack }) => {
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [rules, setRules] = useState({
    hasDigit: false,
    hasSymbol: false,
    hasLetter: false,
    hasMinLength: false,
  });

  const navigate = useNavigate();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    // Checking each rule in real time using Regex
    setRules({
      hasDigit: /\d/.test(value), // Searches for at least one digit
      hasSymbol: /[^A-Za-z0-9]/.test(value), // Searches for any character that is not a letter or a number
      hasLetter: /[A-Za-z]/.test(value), // Searches for at least one letter
      hasMinLength: value.length >= 8, // Checks for a length of 8 characters or more
    });
  };

  const isFormValid =
    rules.hasDigit && rules.hasSymbol && rules.hasLetter && rules.hasMinLength;

  const handleSubmit = (event: React.SubmitEvent) => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    // API request

    // If success
    navigate("/admin-dashboard");
  };

  return (
    <div className={styles.passwordSetupContainer}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={onBack}
        >
          ←
        </button>
        <h3 className={styles.backButton}>Password setup</h3>
      </div>
      <div className={styles.formCotainer}>
        <form onSubmit={handleSubmit} className={styles.passwordSetupForm}>
          <div className={styles.passwordSetupFormMain}>
            <div className={styles.inputField}>
              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Enter your password"
                className={styles.input}
                value={password}
                onChange={(e) => handlePasswordChange(e)}
              />
              <button
                type="button"
                className={styles.toggleButton}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <img
                  src={showPassword ? eyeIcon : eyeOffIcon}
                  alt="Show password"
                />
              </button>
            </div>
            <ul className={styles.listRules}>
              <li
                className={`${styles.listItem} ${rules.hasDigit ? styles.listItemValid : ""}`}
              >
                1+ digit
              </li>
              <li
                className={`${styles.listItem} ${rules.hasSymbol ? styles.listItemValid : ""}`}
              >
                1+ symbol
              </li>
              <li
                className={`${styles.listItem} ${rules.hasLetter ? styles.listItemValid : ""}`}
              >
                1+ letter
              </li>
              <li
                className={`${styles.listItem} ${rules.hasMinLength ? styles.listItemValid : ""}`}
              >
                8+ characters
              </li>
            </ul>
          </div>
          <button
            type="submit"
            className={`${styles.button} ${styles.finishButton}`}
            disabled={!isFormValid}
          >
            Finish
          </button>
        </form>
      </div>
    </div>
  );
};
