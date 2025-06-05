import React from "react";
import { BgGedungProps } from "@/interfaces/BgGedungProps";
import { LogoEmailProps } from "@/interfaces/LogoEmailProps";

export default function BgGedung({
  children,
  className = "",
  style,
}: BgGedungProps) {
  return (
    <section
      className={`flex flex-col min-h-screen w-full bg-cover bg-center bg-no-repeat font-[var(--font-monserrat)] text-white bg-[#023C9B]/85 ${className}`}
      style={{
        backgroundImage: "url('/BgGedung.png')",
      }}
    >
      <main className="flex flex-col text-white space-y-6">{children}</main>
    </section>
  );
}
