import React, { useState } from 'react';
// 1. Import the translation hook from i18next
import { useTranslation } from 'react-i18next';
import styles from './RequestMagicLinkForm.module.scss';

export const RequestMagicLinkForm: React.FC = () => {
  // 2. Initialize the translation function
  const { t } = useTranslation();

  // State to store the email typed by the user
  const [email, setEmail] = useState<string>('');
  
  // State to show a loader spinner during the API request
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // State to toggle between the form and the success message (Connects to SBP-66)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  
  // State to handle and display error messages from the backend
  const [error, setError] = useState<string | null>(null);

  // Function triggered when the user clicks the "Continue" button
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevents the browser from reloading the page
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace this mock with the actual Axios API call once Kamil (BE) provides the endpoint
      // Simulating a network request delay of 1.5 seconds
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // If the request succeeds, we update the state to show the confirmation message
      setIsSubmitted(true);
    } catch (err) {
      console.error('API Error:', err);
      // 3. Set the translated error message directly into the state
      setError(t('login_magic_link.error_generic'));
    } finally {
      setIsLoading(false); // Turn off the loading state
    }
  };

  // SBP-66: If the email was successfully submitted, show the confirmation screen
  if (isSubmitted) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.icon}>✉️</div>
        <h2>{t('login_magic_link.success_title')}</h2>
        <p>
          {t('login_magic_link.success_text_start')}
          <strong>{email}</strong>
          {t('login_magic_link.success_text_end')}
        </p>
      </div>
    );
  }

  // SBP-65: Default view - The email request form (Matching Kamil's user flow chart)
  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>{t('login_magic_link.title')}</h1>
      <p className={styles.subtitle}>{t('login_magic_link.subtitle')}</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            {t('login_magic_link.label_email')}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('login_magic_link.placeholder_email')}
            required
            disabled={isLoading}
            className={styles.input}
          />
        </div>

        {/* Display error message if the API request fails */}
        {error && <p className={styles.errorMessage}>{error}</p>}

        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? t('login_magic_link.button_sending') : t('login_magic_link.button_continue')}
        </button>
      </form>
    </div>
  );
};