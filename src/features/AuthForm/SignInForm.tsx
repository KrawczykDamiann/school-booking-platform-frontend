import { useState } from "react";
import styles from "./AuthForm.module.scss";
import { useNavigate } from "react-router-dom";
import { validation } from "../../utils/validators";
import eyeOffIcon from "../../assets/EyeOffIcon.svg";
import eyeIcon from "../../assets/EyeIcon.svg";
import { login } from "../../api/auth";
import { tokenService } from "../../utils/tokenService";

export const SignInForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    if (emailError) {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);

    if (passwordError) {
      setPasswordError("");
    }
  };

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();

    const errors = {
      email: validation.email(email),
      password: validation.password(password),
    };

    if (errors.email || errors.password) {
      setEmailError(errors.email);
      setPasswordError(errors.password);
      return;
    }

    try {
      const response = await login({
        email,
        password,
      });

      if (response.status === 401) {
        setServerError("Invalid email or password");

        return;
      }

      if (response.status === 400) {
        setServerError("Validation error");

        return;
      }

      tokenService.save(response.data);

      navigate("/admin-dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setServerError("Something went wrong");
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputsContainer}>
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
          </div>
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
            {passwordError && (
              <span className={styles.error}>{passwordError}</span>
            )}
          </div>
          <a href="/password-recovery" className={styles.link}>
            Forgot password?
          </a>
        </div>
        {serverError && <span className={styles.error}>{serverError}</span>}
        <button type="submit" className={styles.button}>
          Continue
        </button>
      </form>
      <div className={styles.languageSelect}>
        <span className={styles.languageText}>Language</span>
        <select name="language" id="language" className={styles.select}>
          <option value="english" className={styles.languageText}>
            EN
          </option>
          <option value="ukrainian" className={styles.languageText}>
            UA
          </option>
        </select>
      </div>
    </>
  );
};
