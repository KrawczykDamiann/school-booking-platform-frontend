import { useState, type InputHTMLAttributes } from "react";
import styles from "./Input.module.scss";
import eyeOffIcon from "../../../assets/EyeOffIcon.svg";
import eyeIcon from "../../../assets/EyeIcon.svg";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string | null;
  showPasswordToggle?: boolean;
  leftIcon?: string;
  rightIcon?: string;
};

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  type = "text",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordInput = type === "password";

  const inputType = isPasswordInput && showPassword ? "text" : type;

  return (
    <div className={styles.inputField}>
      <label
        htmlFor={label}
        className={`${styles.label} ${error ? styles.labelError : ""}`}
      >
        {`${label}*`}
      </label>
      <img src={leftIcon} alt={`${label} icon`} className={styles.icon} />
      <input
        type={inputType}
        className={`${styles.input} ${error && styles.inputError}`}
        {...props}
      />
      {error && <span className={styles.error}>{error}</span>}
      {isPasswordInput && (
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => setShowPassword((prev) => !prev)}
        >
          <img
            src={showPassword ? eyeIcon : eyeOffIcon}
            alt={showPassword ? "Hide password" : "Show password"}
          />
        </button>
      )}
    </div>
  );
};
