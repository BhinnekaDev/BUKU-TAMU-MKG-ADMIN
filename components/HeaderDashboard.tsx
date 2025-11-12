"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface HeaderDashboardProps {
  title: string;
}

interface AdminProfile {
  nama_depan: string;
  nama_belakang: string;
  peran: string;
  foto_admin?: string;
}

// URL backend production
const BASE_URL = "https://buku-tamu-mkg-database.vercel.app/";

function fixFotoUrl(url?: string) {
  return url || "/PotoProfile.png";
}

export default function HeaderDashboard({ title }: HeaderDashboardProps) {
  const router = useRouter();
  const [profileData, setProfileData] = useState<AdminProfile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const user_id = sessionStorage.getItem("user_id");
      const access_token = sessionStorage.getItem("access_token");

      if (!user_id || !access_token) {
        console.error(
          "Data user_id atau access_token tidak ditemukan di sessionStorage"
        );
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}api/admin/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `Bearer ${access_token}`, // ✅ ubah ke Bearer token
            user_id: user_id, // tetap dikirim kalau backend memang butuh
          },
        });

        if (!res.ok) throw new Error("Gagal mengambil profil admin");

        const json = await res.json();

        setProfileData({
          nama_depan: json.data.nama_depan,
          nama_belakang: json.data.nama_belakang,
          peran: json.data.peran,
          foto_admin: json.data.foto, // URL dari Supabase
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    fetchProfile();
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border border-gray-200 rounded-2xl shadow-md mx-4 mt-4 mb-2 backdrop-blur-md">
      <div className="flex items-center justify-between h-20 px-6 py-3 animate-fade-in-up">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1A6EB5] to-[#073CA4] bg-clip-text text-transparent tracking-tight drop-shadow-sm">
          {title}
        </h2>

        <div
          onClick={() => router.push("/pengaturan")}
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              router.push("/pengaturan");
            }
          }}
        >
          <Image
            src={fixFotoUrl(profileData?.foto_admin)}
            width={40}
            height={40}
            alt="Profile"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-300 shadow-sm"
          />
          <div className="text-left sm:text-right">
            <div className="text-sm font-semibold text-gray-800 hidden sm:block">
              {profileData
                ? `${profileData.nama_depan} ${profileData.nama_belakang}`
                : "Admin"}
            </div>
            <div className="text-xs text-gray-500 hidden sm:block">
              {profileData ? profileData.peran : "Peran"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
