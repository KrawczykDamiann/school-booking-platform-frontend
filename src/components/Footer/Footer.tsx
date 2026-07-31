import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import styles from "./Footer.module.scss";

const footerLinks = [
  { id: 1, label: "Legal Center", to: "/" },
  { id: 2, label: "Privacy Policy", to: "/" },
  { id: 3, label: "About us", to: "/" },
  { id: 4, label: "Send feedback", to: "/" },
];

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <span>© 2026 Lessio</span>
      <ul className={styles.linksList}>
        {footerLinks.map((link) => (
          <li className={styles.linkItem} key={link.id}>
            <a href={link.to} className={styles.link}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <LanguageSwitcher />
    </footer>
  );
};
