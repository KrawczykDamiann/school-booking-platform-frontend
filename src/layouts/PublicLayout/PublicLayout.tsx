import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import styles from "./PublicLayout.module.scss";
import LoginModal from "../../components/LoginModal/LoginModal";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";

export default function PublicLayout() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { pathname } = useLocation();

  const isLandingPage = pathname !== "/login";

  return (
    <div className={`${styles.layout} ${isLandingPage ? styles.layoutGrayBackground : ""}`}>
      <Header />
      
      <main className={styles.main}>
        <Outlet />
      </main>

      <Footer />

      {/* Render login modal if state is active */}
      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </div>
  );
}