import { Link, useNavigate } from "react-router-dom";
import styles from "./AdminAuthForm.module.scss";
import { useState } from "react";
import { login } from "../../api/auth";
import { tokenService } from "../../utils/tokenService";
import axios from "axios";
import { validation } from "../../utils/validators";
import emailIcon from "../../assets/email.svg";
import passwordIcon from "../../assets/pass.svg";
import { Input } from "../../components/ui/Input/Input";
import { Checkbox } from "../../components/ui/Checkbox/Checkbox";
import { useInput } from "../../hooks/useInput";

export const AdminAuthForm: React.FC = () => {
  const emailInput = useInput({ validator: validation.validateEmail });
  const passwordInput = useInput({ validator: validation.validatePassword });

  const email = emailInput.value;
  const password = passwordInput.value;

  const [serverError, setServerError] = useState("");

  const [isRememberMe, setIsRememberMe] = useState(false);

  const navigate = useNavigate();

  const isButtonDisabled = !emailInput.value || !passwordInput.value;

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();

    const errors = {
      email: validation.validateEmail(email),
      password: validation.validatePassword(password),
    };

    if (errors.email) {
      emailInput.setError(errors.email);
      return;
    }

    if (errors.password) {
      passwordInput.setError(errors.password);
      return;
    }

    try {
      const response = await login({
        email,
        password,
      });

      tokenService.save(response.data);

      navigate("/admin");
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
          <Input
            label="Email"
            type="email"
            placeholder="admin@email.com"
            value={email}
            onChange={emailInput.onChange}
            onBlur={emailInput.onBlur}
            required
            error={emailInput.error}
            leftIcon={emailIcon}
          />
          <Input
            label="Password"
            type="password"
            placeholder="pass1234"
            value={password}
            onChange={passwordInput.onChange}
            onBlur={passwordInput.onBlur}
            required
            error={passwordInput.error}
            leftIcon={passwordIcon}
          />
        </div>
        <div className={styles.formOptions}>
          <Link
            to="/password-recovery"
            className={styles.link}
            state={{ email: emailInput.value }}
          >
            Forgot your password?
            <span className={styles.linkText}>Request recovery</span>
          </Link>
          <Checkbox
            label="Remember me"
            checked={isRememberMe}
            onChange={(e) => setIsRememberMe(e.target.checked)}
          />
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
