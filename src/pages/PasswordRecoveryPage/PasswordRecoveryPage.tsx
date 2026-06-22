import { useNavigate } from "react-router-dom";
import { PasswordRecoveryForm } from "./components/PasswordRecoveryForm";
import styles from "./PasswordRecoveryPage.module.scss";
import { useState } from "react";
import { PasswordRecoveryEmailSent } from "./components/PasswordRecoveryEmailSent";

export const PasswordRecoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const [isEmailSent, setIsEmailSent] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#E9E9E9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className={styles.wrapper}>
        {!isEmailSent && (
          <div className={styles.header}>
            <button
              onClick={() => navigate("/authorization")}
              className={styles.buttonBack}
            >
              ←
            </button>
            <h3 className={styles.title}>Password recovery</h3>
          </div>
        )}

        {isEmailSent ? (
          <PasswordRecoveryEmailSent />
        ) : (
          <PasswordRecoveryForm onSuccess={() => setIsEmailSent(true)} />
        )}
      </div>
    </div>
  );
};
