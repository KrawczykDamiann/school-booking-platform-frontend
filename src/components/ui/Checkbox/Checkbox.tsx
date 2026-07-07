import type { InputHTMLAttributes } from "react";
import styles from "./Checkbox.module.scss";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string | null;
};

export const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => {
  return (
    <div className={styles.checkboxWrapper}>
      <div className={styles.checkboxField}>
        <label className={styles.checkboxContainer}>
          {label}
          <input type="checkbox" {...props} />
          <span className={styles.checkmark}></span>
        </label>
      </div>
    </div>
  );
};
