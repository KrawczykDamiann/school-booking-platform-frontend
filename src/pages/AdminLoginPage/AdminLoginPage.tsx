import { AdminAuthForm } from "../../features/AdminAuthForm/AdminAuthForm";
import styles from "./AdminLoginPage.module.scss";

export const AdminLoginPage: React.FC = () => {
  return (
    <div className={styles.adminLoginPageWrapper}>
      <div className={styles.layout}>
        <span className={styles.layoutTitle}>Lessio</span>
      </div>
      <AdminAuthForm />
      <div>Language Switcher (coming soon)</div>
    </div>
  );
};
