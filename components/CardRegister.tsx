// components/CardRegister.tsx
import React from "react";

interface CardRegisterProps {
  children: React.ReactNode;
}

export default function CardRegister({ children }: CardRegisterProps) {
  return (
    <div className="flex bg-gradient-to-b from-[#1A6EB5] to-[#073CA4]  rounded-lg shadow-lg overflow-hidden w-[90%] max-w-6xl mx-auto my-10">
      {children}
    </div>
  );
}
