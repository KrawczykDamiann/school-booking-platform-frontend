import { Outlet } from 'react-router-dom';
import styles from './AdminAuthLayout.module.scss';

export const AdminAuthLayout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.logo}>
        <span className={styles.logoTitle}>Lessio</span>
      </div>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};
