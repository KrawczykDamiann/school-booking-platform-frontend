import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary";
type ButtonTheme = "default" | "success" | "error" | "warning" | "info";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: ButtonVariant;
  theme?: ButtonTheme;
  children: ReactNode;
};

export const Button: React.FC<ButtonProps> = ({
  variant,
  theme = "default",
  children,
  ...props
}) => {
  const buttonStyle = styles[`${variant}Button`];

  return (
    <button className={`${styles.button} ${buttonStyle} ${styles[theme]}`} {...props}>
      {children}
    </button>
  );
};
