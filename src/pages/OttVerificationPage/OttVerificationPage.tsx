import styles from "./OttVerificationPage.module.scss";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Tool for handling multi-language translation keys
import { loginStudentWithOtt } from "../../api/auth";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button/Button";

export const OttVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { t } = useTranslation(); // The 't' function fetches strings from your JSON dictionary
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const ottToken = searchParams.get("token");

    if (!ottToken) {
      navigate("/login");
      return;
    }

    const verifyOtt = async () => {
      try {
        const response = await loginStudentWithOtt({
          token: ottToken,
        });

        const token: string = response.token;

        if (token) {
          login({ token, userType: "student" });
          navigate("/booking");
        } else {
          throw new Error("Missing token");
        }
      } catch (error) {
        console.error("Authentication verification failed:", error);
        setIsError(true);
      }
    };

    verifyOtt();
  }, [searchParams, navigate, login]);

  if (isError) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.verificationContainer}>
            <h2 className={styles.errorTitle}>
              {t("auth.callback.errorTitle")}
            </h2>
            <p className={styles.errorText}>{t("auth.callback.errorText")}</p>
            <div className={styles.buttonWrapper}>
              <Button variant="primary" onClick={() => navigate("/login")}>
                {t("auth.callback.backToLogin")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.callbackContainer}>
      <h2 className={styles.loadingTitle}>{t("auth.callback.verifying")}</h2>
    </div>
  );
};
