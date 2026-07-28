import { Outlet } from "react-router-dom";
import styles from "./AdminLayout.module.scss";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { AdminHeader } from "../../components/Header/AdminHeader/AdminHeader";

export default function AdminLayout() {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <AdminHeader />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
