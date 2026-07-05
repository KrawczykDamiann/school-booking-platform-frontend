import { Link, useNavigate } from "react-router-dom";
import styles from "./AdminAuthForm.module.scss";
import { useState } from "react";
import { login } from "../../api/auth";
import { tokenService } from "../../utils/tokenService";
import axios from "axios";
import { validation } from "../../utils/validators";
import eyeOffIcon from "../../assets/EyeOffIcon.svg";
import eyeIcon from "../../assets/EyeIcon.svg";
import emailIcon from "../../assets/email.svg";
import passIcon from "../../assets/pass.svg";

export const AdminAuthForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [serverError, setServerError] = useState("");

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const navigate = useNavigate();

  const isButtonDisabled = !email || !password;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    if (emailError) {
      setEmailError("");
    }
  };

  const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

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

      tokenService.save(response.data);

      navigate("/admin-dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          setServerError("Incorrect email or password");
          return;
        }

        if (error.response?.status === 400) {
          setServerError("Validation error");
          return;
        }

        setServerError("Something went wrong");
        return;
      }

      setServerError("Unknown error");
    }
  };

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Login</h3>
      <span
        className={`${styles.serverError} ${serverError ? styles.serverErrorActive : ""}`}
      >
        {serverError}
      </span>
      <form onSubmit={handleSubmit} className={styles.form} id="login-form">
        <div className={styles.inputsContainer}>
          <div className={styles.inputField}>
            <label
              htmlFor="email"
              className={`${styles.label} ${emailError ? styles.labelError : ""}`}
            >
              Email*
            </label>
            <img src={emailIcon} alt="Email icon" className={styles.icon} />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="admin@email.com"
              className={`${styles.input} ${emailError && styles.inputError}`}
              value={email}
              onChange={(e) => handleEmailChange(e)}
              onBlur={handleEmailBlur}
            />
            {emailError && <span className={styles.error}>{emailError}</span>}
          </div>
          <div className={styles.inputField}>
            <label
              htmlFor="password"
              className={`${styles.label} ${passwordError ? styles.labelError : ""}`}
            >
              Password*
            </label>
            <img src={passIcon} alt="Password icon" className={styles.icon} />
            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="pass1234"
                className={`${styles.input} ${passwordError && styles.inputError}`}
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

            {passwordError && (
              <span className={styles.error}>{passwordError}</span>
            )}
          </div>
        </div>
        <Link to="/password-recovery" className={styles.link} state={{ email }}>
          Forgot your password?
          <span className={styles.linkText}>Request recovery</span>
        </Link>
        <div className={styles.checkboxField}>
          <label className={styles.container}>
            Remember me
            <input
              type="checkbox"
              id="remember-me"
              checked={isTermsAccepted}
              onChange={(e) => setIsTermsAccepted(e.target.checked)}
            />
            <span className={styles.checkmark}></span>
          </label>
        </div>
      </form>
      <button
        type="submit"
        className={styles.button}
        form="login-form"
        disabled={isButtonDisabled}
      >
        Login
      </button>
    </div>
  );
};
