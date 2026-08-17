import { useRef, useState, type InputHTMLAttributes } from "react";
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

  const inputRef = useRef<HTMLInputElement>(null);

  /*

  We prevent the button from taking focus and restore the cursor position
  after toggling the input type. Without this, clicking the "show password"
  button triggers onBlur validation and moves the caret to the beginning
  of the input in some browsers.

  */

  const togglePassword = () => {
    const input = inputRef.current;

    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;

    setShowPassword((prev) => !prev);

    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start ?? 0, end ?? 0);
    });
  };

  return (
    <div className={styles.inputField}>
      <label
        htmlFor={label}
        className={`${styles.label} ${error ? styles.labelError : ""}`}
      >
        {`${label}`}
      </label>
      <div className={styles.inputWrapper}>
        <img src={leftIcon} alt={`${label} icon`} className={styles.icon} />
        <input
          id={label}
          type={inputType}
          className={`${styles.input} ${error && styles.inputError}`}
          {...props}
          ref={inputRef}
        />
        {isPasswordInput && (
          <button
            type="button"
            className={styles.toggleButton}
            // Prevent the toggle button from stealing focus from the input.
            onMouseDown={(e) => e.preventDefault()}
            // Otherwise, clicking the button triggers the input's onBlur validation.

            onClick={togglePassword}
          >
            <img
              src={showPassword ? eyeIcon : eyeOffIcon}
              alt={showPassword ? "Hide password" : "Show password"}
            />
          </button>
        )}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
