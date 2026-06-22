import styles from '../PasswordRecoveryPage.module.scss';

export const PasswordRecoveryEmailSent: React.FC = () => {
  return (
    <div className={styles.emailSent}>
      <h4 className={styles.subtitle}>Check your email</h4>
      <p className={styles.text}>A link to restore your access has been sent to the email address you provided.</p>
    </div>
  );
};
