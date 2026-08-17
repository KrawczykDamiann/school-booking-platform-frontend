import { AdminAuthForm } from "../../features/AdminAuthForm/AdminAuthForm";
import styles from "./AdminLoginPage.module.scss";

export const AdminLoginPage: React.FC = () => {
  return (
    <div className={styles.adminLoginPage}>
      <AdminAuthForm />
    </div>
  );
};
