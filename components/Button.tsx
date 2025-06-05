import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string; // opsional jika tidak pakai children
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  className,
  children,
  ...props
}) => {
  return (
    <button className={className} {...props}>
      {children ?? text}
    </button>
  );
};

export default Button;
