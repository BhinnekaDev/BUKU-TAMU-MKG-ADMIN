"use client";

import { useRef, useState } from "react";
import HeaderDashboard from "@/components/HeaderDashboard";
import Sidebar from "@/components/Sidebar";
import ProfilSaya from "@/components/ProfilSaya";
import { Pencil } from "lucide-react";

export default function ProfilSayaPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState("/PotoProfile.png");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPhotoPreview(previewURL);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f4f6] to-[#e0e7ff] flex">
      {/* Sidebar */}
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderDashboard title="Profil Saya" />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto backdrop-blur-lg shadow-inner rounded-tl-3xl transition-all duration-300">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 transition hover:shadow-xl">
              {/* Judul dan Foto Profil */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative w-20 h-20">
                  <img
                    src={photoPreview}
                    alt="Foto Profil"
                    className="w-20 h-20 rounded-full object-cover border border-gray-300 shadow-sm"
                  />
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow hover:bg-blue-500 group"
                    title="Ganti Foto"
                  >
                    <Pencil className="w-4 h-4 text-gray-600 group-hover:text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800 border-b pb-1">
                    Informasi Profil
                  </h2>
                  <p className="text-sm text-gray-500">
                    Edit data dan foto profil Anda
                  </p>
                </div>
              </div>

              {/* Komponen Edit Profil */}
              <ProfilSaya />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
