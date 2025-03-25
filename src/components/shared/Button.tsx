"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
}: ButtonProps) {
  const baseClasses = "rounded-full font-medium transition-all";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-[#FF00FF] to-[#7B00FF] text-white hover:opacity-90",
    secondary: "bg-gradient-to-r from-[#7B00FF] to-[#FF00FF] text-white hover:opacity-90",
    outline: "border-2 border-[#FF00FF] text-white hover:bg-[#FF00FF]/10"
  };
  
  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-5 py-2",
    lg: "px-6 py-3 text-lg"
  };
  
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button className={combinedClasses} onClick={onClick}>
      {children}
    </button>
  );
} 