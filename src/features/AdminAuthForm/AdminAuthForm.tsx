import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
          setServerError(t("adminAuthForm.errors.invalidCredentials"));
          return;
        }

        if (error.response?.status === 400) {
          setServerError(t("adminAuthForm.errors.validation"));
          return;
        }

        setServerError(t("adminAuthForm.errors.generic"));
        return;
      }

      setServerError(t("adminAuthForm.errors.unknown"));
    }
  };

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{t("adminAuthForm.title")}</h3>
      <span
        className={`${styles.serverError} ${serverError ? styles.serverErrorActive : ""}`}
      >
        {serverError}
      </span>
      <form onSubmit={handleSubmit} className={styles.form} id="login-form">
        <div className={styles.inputsContainer}>
          <Input
            label={t("adminAuthForm.emailLabel")}
            type="email"
            placeholder={t("adminAuthForm.emailPlaceholder")}
            value={email}
            onChange={emailInput.onChange}
            onBlur={emailInput.onBlur}
            required
            error={emailInput.error}
            leftIcon={emailIcon}
          />
          <Input
            label={t("adminAuthForm.passwordLabel")}
            type="password"
            placeholder={t("adminAuthForm.passwordPlaceholder")}
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
            {t("adminAuthForm.forgotPassword")}
          </Link>
          <Checkbox
            label={t("adminAuthForm.rememberMe")}
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
        {t("adminAuthForm.submit")}
      </button>
    </div>
  );
};
