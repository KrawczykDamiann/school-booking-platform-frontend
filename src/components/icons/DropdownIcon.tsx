import React from "react";

interface DropdownIconProps {
  className?: string;
  size: string;
}

export const DropdownIcon: React.FC<DropdownIconProps> = ({
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
        d="M7.678 12.004 3.133 6.449a.6.6 0 0 1-.098-.18.66.66 0 0 1 0-.426.6.6 0 0 1 .098-.18.5.5 0 0 1 .148-.12.38.38 0 0 1 .348 0 .5.5 0 0 1 .147.12L8 10.825l4.224-5.162a.42.42 0 0 1 .321-.163c.12 0 .236.059.322.163a.62.62 0 0 1 .133.393.62.62 0 0 1-.133.393l-4.545 5.555a.5.5 0 0 1-.148.12.38.38 0 0 1-.348 0 .5.5 0 0 1-.148-.12"
      />
    </svg>
  );
};
