import { Outlet } from 'react-router-dom';
import styles from './AdminLayout.module.scss';
import { Header } from '../../components/Header/Header';

export default function AdminLayout() {
  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <Header />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
