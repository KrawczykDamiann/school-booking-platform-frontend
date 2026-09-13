import styles from "./OttVerificationPage.module.scss";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Tool for handling multi-language translation keys
import { loginStudentWithOtt } from "../../api/auth";
import { AuthContext } from "../../context/AuthContext";
import { authStorage } from "../../services/authStorage";
import { ModalContext } from "../../context/ModalContext";
import { Loader } from "../../components/ui/Loader/Loader";

export const OttVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);
  const { t } = useTranslation(); // The 't' function fetches strings from your JSON dictionary
  const { openModal } = useContext(ModalContext);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const ottToken = searchParams.get("token");

    if (!ottToken || isAuthenticated) {
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
          const email = authStorage.getPendingEmail();

          if (!email) {
            return;
          }

          login({ token, userType: "student", email });
          authStorage.clearPendingEmail();
          navigate("/booking-calendar");
        } else {
          throw new Error("Missing token");
        }
      } catch (error) {
        console.error("Authentication verification failed:", error);
        authStorage.clearPendingEmail();
        setIsError(true);
        openModal({ type: "expiredLink" });
      }
    };

    verifyOtt();
  }, [searchParams, navigate, login, openModal, isAuthenticated]);

  return (
    <div className={styles.verificationContainer}>
      <div className={styles.topContainer}>
        {!isError && <Loader />}
        <h2 className={styles.loadingTitle}>
          {t("ottVerification.verifying")}
        </h2>
      </div>
    </div>
  );
};
