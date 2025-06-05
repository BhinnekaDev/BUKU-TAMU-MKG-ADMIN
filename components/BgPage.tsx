import React from "react";
import { BgPageProps } from "@/interfaces/BgPageProps";

export default function BgPage({
  children,
  className = "",
  style,
}: BgPageProps) {
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
