import { Outlet, useLocation } from "react-router-dom";
import styles from "./PublicLayout.module.scss";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";

export default function PublicLayout() {
  const { pathname } = useLocation();
  const isLandingPage = pathname !== "/login";

  return (
    <div
      className={`${styles.layout} ${isLandingPage ? styles.layoutGrayBackground : ""}`}
    >
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
