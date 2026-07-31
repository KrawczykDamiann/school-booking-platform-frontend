import React from "react";

interface ReturnIconProps {
  className?: string;
  size?: number;
}

export const ReturnIcon: React.FC<ReturnIconProps> = ({ className, size }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fill="currentColor"
        d="M6.253 11.627h12.5a.625.625 0 1 1 0 1.25h-12.5a.625.625 0 0 1 0-1.25"
      ></path>
      <path
        fill="currentColor"
        d="m6.51 12.252 5.186 5.182a.628.628 0 0 1-.886.886l-5.626-5.625a.625.625 0 0 1 0-.886l5.626-5.625a.626.626 0 1 1 .886.886z"
      ></path>
    </svg>
  );
};
