import styles from "./PasswordRecoveryPage.module.scss";
import { PasswordRecoveryForm } from "../../features/PasswordRecoveryForm/PasswordRecoveryForm";

export const PasswordRecoveryPage: React.FC = () => {

  return (
    <div className={styles.passwordRecoveryPage}>
      <PasswordRecoveryForm />
    </div>
  );
};
