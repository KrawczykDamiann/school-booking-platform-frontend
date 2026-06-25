import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Tool for handling multi-language translation keys
import { tokenService } from "../../services/tokenService";
import styles from "./AuthCallback.module.scss";

export const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation(); // The 't' function fetches strings from your JSON dictionary
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const urlToken = searchParams.get("token");

    if (!urlToken) {
      navigate("/login");
      return;
    }

    const verifyMagicLink = async () => {
      try {
        const response = await fetch("/api/auth/login/link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: urlToken }),
        });

        if (!response.ok) {
          throw new Error("Invalid token");
        }

        const data = await response.json();
        const sessionToken = data.token; 

        if (sessionToken) {
          tokenService.setToken(sessionToken);
          navigate("/instructors");
        } else {
          throw new Error("Missing token");
        }
      } catch (error) {
        console.error("Authentication verification failed:", error);
        setIsError(true); // Switch our internal local state to error UI mode
      }
    };

    verifyMagicLink();
  }, [searchParams, navigate]);

  // If validation fails, render internationalized error UI elements
  if (isError) {
    return (
      <div className={styles.callbackContainer}>
        <h2 className={styles.errorTitle}>{t("auth.callback.errorTitle")}</h2>
        <p className={styles.errorText}>{t("auth.callback.errorText")}</p>
        <button className={styles.backButton} onClick={() => navigate("/login")}>
          {t("auth.callback.backToLogin")}
        </button>
      </div>
    );
  }

  // Render initial fallback internationalized verification notification
  return (
    <div className={styles.callbackContainer}>
      <h2 className={styles.loadingTitle}>{t("auth.callback.verifying")}</h2>
    </div>
  );
};
