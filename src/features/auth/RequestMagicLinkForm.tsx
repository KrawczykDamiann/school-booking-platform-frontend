import React, { useState } from 'react';
import styles from './RequestMagicLinkForm.module.scss';

export const RequestMagicLinkForm: React.FC = () => {
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
      // If the backend returns an error, we catch it and display it to the user
      console.error('API Error:', err);
      setError('Something went wrong. Please check your email and try again.');
    } finally {
      setIsLoading(false); // Turn off the loading state
    }
  };

  // SBP-66: If the email was successfully submitted, show the confirmation screen
  if (isSubmitted) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.icon}>✉️</div>
        <h2>Check your inbox!</h2>
        <p>
          We have sent a secure magic login link to <strong>{email}</strong>. 
          Click the link in the email to log in.
        </p>
      </div>
    );
  }

  // SBP-65: Default view - The email request form (Matching Kamil's user flow chart)
  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>Welcome!</h1>
      <p className={styles.subtitle}>Enter your email to continue</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@example.com"
            required
            disabled={isLoading}
            className={styles.input}
          />
        </div>

        {/* Display error message if the API request fails */}
        {error && <p className={styles.errorMessage}>{error}</p>}

        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? 'Sending...' : 'Continue'}
        </button>
      </form>
    </div>
  );
};