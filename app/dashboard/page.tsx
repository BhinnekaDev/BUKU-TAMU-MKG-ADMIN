"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import HeaderDashboard from "@/components/HeaderDashboard";
import StatCard from "@/components/StatCard";
import GrafikPengunjung from "@/components/GrafikPengunjung";
import JadwalSchedule from "@/components/JadwalSchedule";
import PengunjungInstitusi from "@/components/PengunjungIntitusi";
import AksiCepat from "@/components/AksiCepat";
import Footer from "@/components/Footer";

type FilterType = "today" | "week" | "month";

interface StatsData {
  totalVisits: number;
  sedangDitinjau: number;
  diterima: number;
  ditolak: number;
  peakTime: string;
}

export default function DashboardPage() {
  const [filter, setFilter] = useState<FilterType>("today");

  const filterButtons = [
    { label: "Hari Ini", value: "today" },
    { label: "Minggu Ini", value: "week" },
    { label: "Bulan Ini", value: "month" },
  ];

  // Data statistik lengkap per filter
  const stats: Record<FilterType, StatsData> = {
    today: {
      totalVisits: 100,
      sedangDitinjau: 10,
      diterima: 5,
      ditolak: 2,
      peakTime: "10:00",
    },
    week: {
      totalVisits: 500,
      sedangDitinjau: 40,
      diterima: 30,
      ditolak: 10,
      peakTime: "11:30",
    },
    month: {
      totalVisits: 2000,
      sedangDitinjau: 120,
      diterima: 100,
      ditolak: 40,
      peakTime: "14:45",
    },
  };

  const currentStats = stats[filter];

  return (
    <div className="flex h-screen">
      <Sidebar />

      {/* Kontainer utama yang bisa di-scroll */}
      <div className="flex-1 flex flex-col bg-[#f6f9fc] overflow-y-auto max-h-screen">
        <HeaderDashboard title="Dashboard" />

        {/* Judul dan Filter */}
        <div className="flex items-center justify-between px-7 pt-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1A6EB5] to-[#073CA4]"></h2>
          <div className="flex gap-2">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value as FilterType)}
                className={`px-4 py-1.5 cursor-pointer rounded-lg text-sm font-medium transition duration-200 ${
                  filter === btn.value
                    ? "bg-[#1A6EB5] text-white shadow"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 px-6 py-6">
          <StatCard
            title="Total Kunjungan"
            value={`${currentStats.totalVisits}+`}
            color="#05225E"
          />
          <StatCard
            title="Sedang Ditinjau"
            value={`${currentStats.sedangDitinjau}+`}
            color="#05429E"
          />
          <StatCard
            title="Diterima"
            value={`${currentStats.diterima}+`}
            color="#59A1CE"
          />
          <StatCard
            title="Ditolak"
            value={`${currentStats.ditolak}+`}
            color="#05429E"
          />
          <StatCard
            title="Peak Time"
            value={currentStats.peakTime}
            color="#05225E"
          />
        </div>

        {/* Komponen lainnya */}
        <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GrafikPengunjung filter={filter} />
          <JadwalSchedule />
          <PengunjungInstitusi />
          <AksiCepat />
        </div>
      </div>
    </div>
  );
}
