"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

const dummyNotifications = [
  {
    id: 1,
    title: "Pengunjung Baru",
    message: "Ada 5 pengunjung baru hari ini.",
    time: "5 menit lalu",
  },
  {
    id: 2,
    title: "Laporan Mingguan",
    message: "Laporan kunjungan minggu ini sudah tersedia.",
    time: "1 jam lalu",
  },
  {
    id: 3,
    title: "Permintaan Akses",
    message: "User meminta akses ke laporan departemen.",
    time: "Kemarin",
  },
];

export default function NotifikasiAdmin() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handler klik setiap notifikasi
  const handleClickNotification = (id: number, title: string) => {
    alert(`Kamu klik notifikasi: ${title} (id: ${id})`);
    // Contoh: bisa tambah logic lain, misal navigasi atau update status sudah dibaca
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-gray-100 cursor-pointer transition relative"
      >
        <Bell className="h-5 w-5 text-gray-700" />
        {dummyNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full shadow-md">
            {dummyNotifications.length}
          </span>
        )}
      </button>

      {/* Dropdown Notification */}
      <div
        className={`absolute right-0 mt-3 w-80 z-50 transition-all duration-300 ease-out ${
          open
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-2 invisible"
        }`}
      >
        <div className="rounded-xl bg-white border border-white/30 shadow-xl overflow-hidden backdrop-blur-md">
          <div className="cursor-move p-4 border-b border-gray-200 font-semibold text-gray-800 bg-gradient-to-r from-white/60 to-white/30">
            Notifikasi Admin
          </div>

          <ul className="max-h-72 overflow-y-auto">
            {dummyNotifications.map((notif) => (
              <li
                key={notif.id}
                onClick={() => handleClickNotification(notif.id, notif.title)}
                className="px-4 py-3 hover:bg-white/60 transition border-b border-gray-100 cursor-pointer"
              >
                <p className="text-sm font-medium text-gray-800">
                  {notif.title}
                </p>
                <p className="text-sm text-gray-600">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
              </li>
            ))}
          </ul>

          <div className="text-center p-3 text-sm text-blue-600 hover:underline hover:text-blue-700 transition cursor-pointer bg-white/50">
            Lihat semua notifikasi
          </div>
        </div>
      </div>
    </div>
  );
}
