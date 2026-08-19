import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import styles from "./Footer.module.scss";

interface FooterLink {
  id: number;
  translationKey: string;
  to: string;
}

const footerLinks: FooterLink[] = [
  { id: 1, translationKey: "footer.legalCenter", to: "/legal" },
  { id: 2, translationKey: "footer.privacyPolicy", to: "/privacy" },
  { id: 3, translationKey: "footer.aboutUs", to: "/about" },
  { id: 4, translationKey: "footer.sendFeedback", to: "/feedback" },
];

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={styles.leftSection}>
        {/* Hidden admin access for MVP/Demo */}
        <Link to="/admin" className={styles.copyright}>
          © 2026 Lessio
        </Link>
      </div>

      <ul className={styles.linksList}>
        {footerLinks.map((link) => (
          <li className={styles.linkItem} key={link.id}>
            <Link to={link.to} className={styles.link}>
              {t(link.translationKey)}
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.rightSection}>
        <LanguageSwitcher />
      </div>
    </footer>
  );
};