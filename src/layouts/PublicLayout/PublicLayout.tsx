import { Outlet, useLocation } from "react-router-dom";
import styles from "./PublicLayout.module.scss";
import { useState } from "react";
import LoginModal from "../../components/LoginModal/LoginModal";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";

export default function PublicLayout() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { pathname } = useLocation();

  const isLandingPage = pathname !== "/login";

  return (
    <div className={`${styles.layout} ${isLandingPage ? styles.layoutGrayBackground : ""}`}>
      <Header onLoginClick={() => setIsLoginModalOpen(true)} />
      
      <main className={styles.main}>
        <Outlet />
      </main>

      <Footer />

      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </div>
  );
}