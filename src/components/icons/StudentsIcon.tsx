import React from "react";

interface StudentsIconProps {
  className?: string;
  size: string;
}

export const StudentsIcon: React.FC<StudentsIconProps> = ({
  className,
  size,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fill="currentColor"
        d="m14.158 3.526-6-2a.5.5 0 0 0-.316 0l-6 2A.5.5 0 0 0 1.5 4v5a.5.5 0 0 0 1 0V4.694l2.1.7a4 4 0 0 0 1.29 5.502c-1.125.441-2.097 1.24-2.809 2.33a.5.5 0 1 0 .838.547C4.86 12.328 6.349 11.5 8 11.5s3.14.828 4.081 2.273a.5.5 0 0 0 .838-.546c-.712-1.091-1.688-1.89-2.809-2.33a4 4 0 0 0 1.29-5.5l2.758-.92a.5.5 0 0 0 0-.948zM11 7.5a3.001 3.001 0 1 1-5.416-1.778l2.258.75a.5.5 0 0 0 .316 0l2.258-.75c.38.515.584 1.138.584 1.778"
      ></path>
    </svg>
  );
};
