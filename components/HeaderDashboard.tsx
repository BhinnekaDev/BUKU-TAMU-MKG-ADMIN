"use client";
import React from "react";
import { useRouter } from "next/navigation"; // import useRouter dari next/navigation
import AdminProfile from "./ProfileAdmin";
import NotifikasiAdmin from "./NotifikasiAdmin";

interface HeaderDashboardProps {
  title: string;
}

export default function HeaderDashboard({ title }: HeaderDashboardProps) {
  const router = useRouter(); // buat router instance

  return (
    <header className="sticky top-0 z-40 bg-white border border-gray-200 rounded-2xl shadow-md mx-4 mt-4 mb-2 backdrop-blur-md">
      <div className="flex items-center justify-between h-20 px-6 py-3 animate-fade-in-up">
        {/* Judul */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1A6EB5] to-[#073CA4] bg-clip-text text-transparent tracking-tight drop-shadow-sm">
          {title}
        </h2>

        {/* Notifikasi + Profil */}
        <div className="flex items-center gap-4">
          <NotifikasiAdmin />

          <div
            onClick={() => router.push("/pengaturan")} // navigasi programmatically
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                router.push("/pengaturan");
              }
            }}
          >
            <img
              src="/PotoProfile.png"
              alt="Profile"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-300 shadow-sm"
            />
            <div className="text-left sm:text-right">
              <div className="text-sm font-semibold text-gray-800 hidden sm:block">
                Admin User
              </div>
              <div className="text-xs text-gray-500 hidden sm:block">
                Administrator
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
