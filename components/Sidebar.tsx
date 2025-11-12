"use client";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Settings,
  Sun,
  Thermometer,
  Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import IconBMKG from "./IconBMKG";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMini, setIsMini] = useState(false);
  const [isSuperadmin, setIsSuperadmin] = useState<boolean | null>(null);

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

  useEffect(() => {
    const status = sessionStorage.getItem("isSuperadmin");
    if (status === "true") setIsSuperadmin(true);
    else setIsSuperadmin(false);
  }, []);

  const navItems = [
    { label: "Dashboard", icon: <Home size={18} />, path: "/dashboard" },
    {
      label: "Kelola Tamu",
      icon: <BookOpen size={18} />,
      path: "/kelolabukutamu",
    },
    { label: "Kelola Admin", icon: <Users size={18} />, path: "/kelolaadmin" },
    { label: "Pengaturan", icon: <Settings size={18} />, path: "/pengaturan" },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (item.label === "Kelola Admin" && isSuperadmin === false) {
      return false;
    }
    return true;
  });

  const handleLogout = () => {
    sessionStorage.clear();
    sessionStorage.clear();
    toast.success("Anda berhasil logout");
    router.push("/");
  };

  return (
    <aside
      className={`transition-[width] duration-300 ease-in-out bg-gradient-to-b from-[#1A6EB5] to-[#073CA4] shadow-md rounded-2xl m-4 p-4 flex flex-col border border-white/20 ${
        isMini ? "w-20" : "w-64"
      } max-h-[90vh]`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex items-center gap-3">
          <IconBMKG
            logo="/LogoBmkgSmall.png"
            horizontal={!isMini}
            imgClassName="w-10 h-9"
            className="mr-2"
          />
          {!isMini && (
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

        <button
          onClick={() => setIsMini(!isMini)}
          className="text-white hover:bg-white/10 p-1 cursor-pointer rounded-md"
          title={isMini ? "Perbesar" : "Perkecil"}
        >
          {isMini ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigasi */}
      <nav className="mt-4 px-1 space-y-2">
        {filteredNavItems.map(({ label, icon, path }) => {
          const isActive = pathname === path;
          return (
            <div key={label} className="relative">
              {isActive && (
                <div className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-md" />
              )}
              <button
                onClick={() => router.push(path)}
                className={`w-full flex items-center cursor-pointer gap-3 px-3 py-2 pl-4 rounded-md text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-white/20 text-white font-semibold"
                    : "text-white hover:bg-white/10"
                }
              `}
              >
                {icon}
                {!isMini && <span>{label}</span>}
              </button>
            </div>
          );
        })}
      </nav>

      {/* Info Cuaca & Jam */}
      {!isMini && (
        <div className="mt-8 px-2">
          <div className="space-y-3 p-3 rounded-lg backdrop-blur-sm animate-fade-in">
            <div className="flex justify-between items-center border border-white/30 rounded-md p-2 bg-white/10">
              <div className="flex items-center gap-1 text-white text-sm font-semibold">
                <Sun size={14} />
                <span>Sebagian berawan</span>
              </div>
              <div className="flex items-center gap-1 text-white text-xs">
                <Thermometer size={12} />
                28°C
              </div>
            </div>
            <div className="border border-white/30 rounded-md p-3 flex flex-col bg-white/10 text-white text-sm font-light">
              <div className="flex justify-end">
                <div className="text-sm font-semibold">{currentTime}</div>
              </div>
              <div className="text-sm text-white/70">Waktu Saat Ini</div>
              <div className="mb-1">{currentDate}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tombol Logout */}
      <div className="mt-auto p-2">
        <button
          onClick={handleLogout}
          className="w-full cursor-pointer flex items-center justify-center gap-2 px-3 py-2 hover:bg-white/10 text-sm text-white rounded-xl font-medium transition duration-200"
        >
          <LogOut size={16} />
          {!isMini && "Logout"}
        </button>
      </div>
    </aside>
  );
}
