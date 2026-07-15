import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    text: string;
};

export const Button: React.FC<ButtonProps> = ({ text, ...props }) => {
    return (
        <button className={styles.button} {...props}>{text}</button>
    );
};