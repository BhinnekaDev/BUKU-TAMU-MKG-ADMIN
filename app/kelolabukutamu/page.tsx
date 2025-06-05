"use client";

import Sidebar from "@/components/Sidebar";
import HeaderDashboard from "@/components/HeaderDashboard";
import KelolaBukuTamu from "@/components/KelolaBukuTamu";
import Footer from "@/components/Footer";

export default function KelolaBukuTamuPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-[#f6f9fc] overflow-y-auto">
        <HeaderDashboard title="Kelola Tamu" />

        <div className="px-6 py-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1A6EB5] to-[#073CA4] mb-4"></h2>

          <KelolaBukuTamu />
        </div>
        <Footer />
      </div>
    </div>
  );
}
