import { Link, useNavigate } from "react-router-dom";
import styles from "./AdminAuthForm.module.scss";
import { useContext, useState } from "react";
import axios from "axios";
import { validation } from "../../utils/validators";
import emailIcon from "../../assets/email.svg";
import passwordIcon from "../../assets/pass.svg";
import { Input } from "../../components/ui/Input/Input";
import { Checkbox } from "../../components/ui/Checkbox/Checkbox";
import { useInput } from "../../hooks/useInput";
import { AuthContext } from "../../context/AuthContext";
import { loginAdmin } from "../../api/auth";
import { Button } from "../../components/ui/Button/Button";

export const AdminAuthForm: React.FC = () => {
  const emailInput = useInput({ validator: validation.validateEmail });
  const passwordInput = useInput({ validator: validation.validatePassword });

  const email = emailInput.value;
  const password = passwordInput.value;

  const [serverError, setServerError] = useState("");

  const [isRememberMe, setIsRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const isButtonDisabled =
    !emailInput.value || !passwordInput.value || isLoading;

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    setServerError("");

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

    setIsLoading(true);

    try {
      const response = await loginAdmin({
        email,
        password,
      });

      const token: string = response.token;

      login({ token, userType: "admin" });
      navigate("/admin");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseStatus = error.response?.status;

        if (responseStatus === 401 || responseStatus === 403) {
          setServerError("Incorrect email or password");
          return;
        }

        if (responseStatus === 500) {
          setServerError("Server error");
          return;
        }
      }

      setServerError("Unknown error");
    } finally {
      setIsLoading(false);
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
          </Link>
          <Checkbox
            label="Remember me"
            checked={isRememberMe}
            onChange={(e) => setIsRememberMe(e.target.checked)}
          />
        </div>
      </form>
      <div className={styles.buttonWrapper}>
        <Button
          variant="primary"
          type="submit"
          form="login-form"
          disabled={isButtonDisabled}
        >
          Login
        </Button>
      </div>
    </div>
  );
};
