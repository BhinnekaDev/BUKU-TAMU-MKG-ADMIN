"use client";

import IconBMKG from "./IconBMKG";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  Users,
  FileText,
  Settings,
  LogOut,
  Sun,
  Thermometer,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // State waktu
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString("id-ID", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  );
  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("id-ID", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Navigasi menu
  const navItems = [
    { label: "Dashboard", icon: <Home size={16} />, path: "/dashboard" },
    {
      label: "Kelola Tamu",
      icon: <Users size={16} />,
      path: "/kelolabukutamu",
    },
    { label: "Laporan", icon: <FileText size={16} />, path: "/laporan" },
    { label: "Pengaturan", icon: <Settings size={16} />, path: "/pengaturan" },
  ];

  return (
    <aside
      className={`bg-gradient-to-b from-[#1A6EB5] to-[#073CA4] shadow-md rounded-2xl m-4 p-4 border border-white/20 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white focus:outline-none"
          title={isCollapsed ? "Tampilkan Sidebar" : "Sembunyikan Sidebar"}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-2 ${
          isCollapsed ? "justify-center" : "px-4"
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-6">
          <IconBMKG
            logo="/LogoBmkgSmall.png"
            horizontal
            imgClassName="w-10 h-9"
            className="mr-2"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white text-lg font-bold leading-tight">
              BMKG
            </span>
            <span className="text-[10px] text-white/70 uppercase block -mt-1">
              Provinsi Bengkulu
            </span>
          </IconBMKG>
          {!isCollapsed && (
            <div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white text-lg font-bold leading-tight">
                BMKG
              </span>
              <span className="text-[10px] text-white/70 uppercase block -mt-1">
                Provinsi Bengkulu
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigasi Menu */}
      <nav
        className={`mt-6 ${
          isCollapsed ? "flex flex-col items-center" : "px-4 space-y-1"
        }`}
      >
        {navItems.map(({ label, icon, path }) => (
          <button
            key={label}
            onClick={() => router.push(path)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/10 text-sm text-white font-medium transition duration-200 ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={label}
          >
            {icon}
            {!isCollapsed && label}
          </button>
        ))}
      </nav>

      {/* Informasi dan Cuaca */}
      <div
        className={`mt-8 ${
          isCollapsed ? "flex flex-col items-center" : "px-4"
        }`}
      >
        <div className="space-y-3 p-3 rounded-lg backdrop-blur-sm animate-fade-in">
          <div className="flex justify-between items-center border border-white/30 rounded-md p-2 bg-white/10">
            <div className="flex items-center gap-1 text-white text-sm font-semibold">
              <Sun size={14} />
              {!isCollapsed && <span>Sebagian berawan</span>}
            </div>
            <div className="flex items-center gap-1 text-white text-xs">
              <Thermometer size={12} />
              {!isCollapsed && "28°C"}
            </div>
          </div>
          {!isCollapsed && (
            <div className="border border-white/30 rounded-md p-3 flex flex-col bg-white/10 text-white text-sm font-light">
              <div className="flex justify-end">
                <div className="text-sm font-semibold">{currentTime}</div>
              </div>
              <div className="text-sm text-white/70">Waktu Saat Ini</div>
              <div className="mb-1">{currentDate}</div>
            </div>
          )}
        </div>
      </div>

      {/* Tombol Logout */}
      <div className="mt-auto p-4">
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 hover:bg-white/10 text-sm text-white rounded-xl font-medium transition duration-200">
          <LogOut size={16} /> {!isCollapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
