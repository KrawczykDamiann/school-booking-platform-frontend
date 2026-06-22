import { useState } from "react";
import styles from "../AuthForm.module.scss";
import { validation } from "../../../utils/validators";

type Props = {
  onContinue: () => void;
};

export const SignUpForm: React.FC<Props> = ({ onContinue }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [businessName, setBusinessName] = useState("");
  const [businessNameError, setBusinessNameError] = useState("");

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    if (emailError) {
      setEmailError("");
    }
  };

  const handleBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessName(e.target.value);

    if (businessNameError) {
      setBusinessNameError("");
    }
  };

  const handleTermsAcceptedChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setIsTermsAccepted(e.target.checked);

    if (termsError) {
      setTermsError("");
    }
  };

  const validateBusinessName = (value: string) => {
    if (!value.trim()) {
      return "Business name is required";
    }
    return "";
  };

  const handleSubmit = (event: React.SubmitEvent) => {
    event.preventDefault();

    const errors = {
      email: validation.email(email),
      businessName: validateBusinessName(businessName),
    };

    if (errors.email || errors.businessName || !isTermsAccepted) {
      setEmailError(errors.email);
      setBusinessNameError(errors.businessName);
      setTermsError("You must accept the terms");
      return;
    }

    onContinue();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.signUpForm}>
      <div className={styles.inputsContainer}>
        <div className={styles.inputField}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="admin@email.rom"
            className={`${styles.input} ${emailError && styles.inputError}`}
            value={email}
            onChange={(e) => handleEmailChange(e)}
          />
          {emailError && <span className={styles.error}>{emailError}</span>}
        </div>
        <div className={styles.inputField}>
          <label htmlFor="business-name"></label>
          <input
            type="text"
            name="business-name"
            id="business-name"
            placeholder="Business name*"
            className={`${styles.input} ${businessNameError ? styles.inputError : ""}`}
            value={businessName}
            onChange={(e) => handleBusinessNameChange(e)}
          />
          {businessNameError && (
            <span className={styles.error}>{businessNameError}</span>
          )}
        </div>
      </div>
      <div className={styles.checkboxField}>
        <input
          type="checkbox"
          id="terms"
          className={styles.realCheckbox}
          checked={isTermsAccepted}
          onChange={(e) => handleTermsAcceptedChange(e)}
        />
        <label htmlFor="terms" className={styles.customCheckboxLabel}>
          By signing up I agree to the terms of service...
        </label>
        {termsError && <span className={styles.error}>{termsError}</span>}
      </div>
      <button type="submit" className={styles.button}>
        Continue
      </button>
    </form>
  );
};
