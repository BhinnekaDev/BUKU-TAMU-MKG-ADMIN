"use client";

import { useState } from "react";
import { LogOut, Pencil } from "lucide-react";
import Image from "next/image";

export default function AdminProfile() {
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    alert("Anda telah logout."); // Ganti dengan logika logout sesungguhnya
  };

  return (
    <div className="relative">
      <div
        className="flex items-center gap-3 bg-white shadow-md rounded-xl px-4 py-2 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setShowModal(true)}
      >
        <Image
          src="/PotoProfile.png"
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full border border-gray-300 object-cover"
        />
        <div className="text-sm">
          <div className="font-semibold text-gray-800">Admin User</div>
          <div className="text-xs text-gray-500">Administrator</div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-lg animate-fade-in-up">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Profil Admin
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <Image
                src="/PotoProfile.png"
                alt="Profile"
                width={60}
                height={60}
                className="rounded-full border border-gray-300 object-cover"
              />
              <div>
                <div className="font-medium text-gray-700">Admin User</div>
                <div className="text-sm text-gray-500">Administrator</div>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-lg py-2 transition mb-3">
              <Pencil size={16} /> Edit Profil
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-sm text-red-600 border border-red-600 hover:bg-red-50 rounded-lg py-2 transition"
            >
              <LogOut size={16} /> Logout
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="text-sm text-gray-400 hover:text-gray-600 mt-4 block mx-auto"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
