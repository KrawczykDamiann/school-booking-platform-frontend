import { Outlet } from "react-router-dom";
import styles from "./AdminAuthLayout.module.scss";
import { LanguageSwitcher } from "../../components/LanguageSwitcher/LanguageSwitcher";

export const AdminAuthLayout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.logo}>
        <span className={styles.logoTitle}>Lessio</span>
      </div>
      <main className={styles.content}>
        <Outlet />
        <div className={styles.languageSwitcherContainer}>
          <LanguageSwitcher />
        </div>
      </main>
    </div>
  );
};
