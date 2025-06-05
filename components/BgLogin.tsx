import React from "react";
import { BgLoginProps } from "@/interfaces/BgLoginProps";

export default function BgLogin({ children }: BgLoginProps) {
  // Gambar latar belakang login
  const gambarLatarBgLogin = "/assets/bg_gedung.png";

  return (
    <section className="bg-[#1670ba] w-[1024] h-[1536] bg-cover bg-center h-screen font-[family-name:var(--font-montserrat)]">
      <div
        className="h-full w-full bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${gambarLatarBgLogin})` }}
      >
        {/* Slot isi halaman login */}
        {children}
      </div>
    </section>
  );
}
