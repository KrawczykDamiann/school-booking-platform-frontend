import { Outlet } from "react-router-dom";
import { Footer } from "../../components/Footer/Footer";
import styles from "./PublicLayout.module.scss";
import { useState } from "react";
import LoginModal from "../../components/LoginModal/LoginModal";
import { PublicHeader } from "../../components/Header/PublicHeader/PublicHeader";

export default function PublicLayout() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <PublicHeader onLoginClick={() => setIsLoginModalOpen(true)} />
        {/* <Header variant="student" onLoginClick={() => setIsLoginModalOpen(true)} /> */}
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
