"use client";

import GrafikPengunjung from "@/components/GrafikPengunjung";
import HeaderDashboard from "@/components/HeaderDashboard";
import PengunjungInstitusi from "@/components/PengunjungIntitusi";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import { useEffect, useState } from "react";

type FilterType = "today" | "week" | "month";

interface TamuData {
  Waktu_Kunjungan: string;
  Pengunjung?: {
    Asal_Pengunjung?: string;
    [key: string]: unknown;
  };
  Keperluan?: string;
  [key: string]: unknown;
}

export default function DashboardPage() {
  const [filter, setFilter] = useState<FilterType>("today");
  const [jadwaltamu, setJadwaltamu] = useState<TamuData[]>([]);
  const [jumlahTamu, setJumlahTamu] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [monthCount, setMonthCount] = useState(0);

  const [grafikData, setGrafikData] = useState<{
    today: { hour: string; visitors: number }[];
    week: { hour: string; visitors: number }[];
    month: { hour: string; visitors: number }[];
  }>({
    today: [],
    week: [],
    month: [],
  });

  // --- Fungsi bantu untuk mengelompokkan data ke format grafik ---
  const groupDataForChart = (data: TamuData[], period: FilterType) => {
    const weekDays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const map = new Map<string, number>();

    data.forEach((item) => {
      const raw = item.Waktu_Kunjungan;
      if (!raw) return;

      // contoh: "Selasa, 7 Oktober 2025, 11.54"
      const parts = raw.split(", ");
      const jamStr = parts?.[2]?.split(".")?.[0] || "";
      const tanggal = parts?.[1] || "";

      let label = "";

      if (period === "today") {
        // tampilkan berdasarkan jam
        label = `${jamStr}:00`;
      } else if (period === "week") {
        // tampilkan berdasarkan hari
        label = parts?.[0]?.slice(0, 3) || "";
      } else if (period === "month") {
        // tampilkan berdasarkan tanggal
        label = tanggal.split(" ")[0];
      }

      if (label) {
        map.set(label, (map.get(label) || 0) + 1);
      }
    });

    let result: { hour: string; visitors: number }[] = [];
    if (period === "week") {
      result = weekDays
        .filter((d) => map.has(d))
        .map((d) => ({ hour: d, visitors: map.get(d)! }));
    } else {
      result = Array.from(map.entries()).map(([hour, visitors]) => ({
        hour,
        visitors,
      }));
    }

    return result;
  };

  useEffect(() => {
    let hasFetched = false;

    const fetchDashboardData = async () => {
      if (hasFetched) return;
      hasFetched = true;

      try {
        const token = sessionStorage.getItem("access_token");
        const userID = sessionStorage.getItem("user_id");

        if (!userID || !token) {
          console.warn("Token atau User ID kosong");
          return;
        }

        const baseURL =
          "https://buku-tamu-mkg-database.vercel.app/api/admin/buku-tamu";

        const headers = {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          user_id: userID,
        };

        const [todayRes, weekRes, monthRes, totalRes] = await Promise.all([
          fetch(`${baseURL}?period=today`, { headers }),
          fetch(`${baseURL}?period=week`, { headers }),
          fetch(`${baseURL}?period=month`, { headers }),
          fetch(baseURL, { headers }),
        ]);

        const todayJson = await todayRes.json();
        const weekJson = await weekRes.json();
        const monthJson = await monthRes.json();
        const totalJson = await totalRes.json();

        setTodayCount(todayJson.count || todayJson.data?.length || 0);
        setWeekCount(weekJson.count || weekJson.data?.length || 0);
        setMonthCount(monthJson.count || monthJson.data?.length || 0);
        setJumlahTamu(totalJson.count || totalJson.data?.length || 0);

        const grouped = {
          today: groupDataForChart(todayJson.data || [], "today"),
          week: groupDataForChart(weekJson.data || [], "week"),
          month: groupDataForChart(monthJson.data || [], "month"),
        };

        setGrafikData(grouped);
        setJadwaltamu(totalJson.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const filterButtons = [
    { label: "Hari Ini", value: "today" },
    { label: "Minggu Ini", value: "week" },
    { label: "Bulan Ini", value: "month" },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-[#f6f9fc] overflow-y-auto max-h-screen">
        <HeaderDashboard title="Dashboard" />

        {/* Filter tombol */}
        <div className="flex items-center justify-between px-7 pt-6">
          <div></div>
          <div className="flex gap-2">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value as FilterType)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
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

        {/* Statistik ringkas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-6 py-6">
          <StatCard
            title="Tamu Hari Ini"
            value={`${todayCount}`}
            color="#05429E"
          />
          <StatCard
            title="Tamu Minggu Ini"
            value={`${weekCount}`}
            color="#1A6EB5"
          />
          <StatCard
            title="Tamu Bulan Ini"
            value={`${monthCount}`}
            color="#59A1CE"
          />
          <StatCard
            title="Total Kunjungan"
            value={`${jumlahTamu}`}
            color="#05225E"
          />
        </div>

        {/* Grafik */}
        <div className="px-6 pb-6">
          <GrafikPengunjung filter={filter} data={grafikData[filter] || []} />
        </div>

        {/* Tabel institusi */}
        <div>
          <PengunjungInstitusi data={jadwaltamu} />
        </div>
      </div>
    </div>
  );
}
