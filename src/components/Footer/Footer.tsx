import styles from './Footer.module.scss';

export const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div>
                Language Switcher (coming soon)
            </div>
            <p>Temporary: text-button links for easier navigation to admin entry point (login + dashboard)</p>
            <span>Copyright</span>
        </footer>
    );
};