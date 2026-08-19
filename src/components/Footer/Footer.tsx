import React from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import styles from "./Footer.module.scss";

interface FooterLink {
  id: number;
  translationKey: string;
  to: string;
}

const footerLinks: FooterLink[] = [
  { id: 1, translationKey: "footer.legalCenter", to: "/" },
  { id: 2, translationKey: "footer.privacyPolicy", to: "/" },
  { id: 3, translationKey: "footer.aboutUs", to: "/" },
  { id: 4, translationKey: "footer.sendFeedback", to: "/" },
];

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <span>© 2026 Lessio</span>
      <ul className={styles.linksList}>
        {footerLinks.map((link) => (
          <li className={styles.linkItem} key={link.id}>
            <a href={link.to} className={styles.link}>
              {t(link.translationKey)}
            </a>
          </li>
        ))}
      </ul>
      <LanguageSwitcher />
    </footer>
  );
};
