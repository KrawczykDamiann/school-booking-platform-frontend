import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "../../components/Footer/Footer";
import styles from "./PublicLayout.module.scss";
import { useState } from "react";
import LoginModal from "../../components/LoginModal/LoginModal";
import { Header } from "../../components/Header/Header";

export default function PublicLayout() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { pathname } = useLocation();

  const isHeaderVisible =
    pathname !== "/login/admin" && pathname !== "/password-recovery";

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        {isHeaderVisible && <Header onLoginClick={() => setIsLoginModalOpen(true)} />}
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>

      <Footer />

      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </div>
  );
}
