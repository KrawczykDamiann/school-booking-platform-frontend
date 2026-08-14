import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary" | "primaryModal" | "secondaryModal";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: ButtonVariant;
  children: ReactNode;
};

export const Button: React.FC<ButtonProps> = ({
  variant,
  children,
  ...props
}) => {
  const buttonStyle = styles[`${variant}Button`];

  return (
    <button className={`${styles.button} ${buttonStyle}`} {...props}>
      {children}
    </button>
  );
};
