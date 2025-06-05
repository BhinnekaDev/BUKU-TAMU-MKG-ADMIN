"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import HeaderDashboard from "@/components/HeaderDashboard";
import KelolaBukuTamu from "@/components/KelolaBukuTamu";
import Footer from "@/components/Footer";
import CardLaporan from "@/components/CardLaporan";
import Button from "@/components/Button";
import { IoMdPrint } from "react-icons/io";
import CardPengunjungDepartemen from "@/components/CardPengunjungDepartemen";
import CardPengunjungTujuan from "@/components/CardPengunjungTujuan";
import CardJamPuncakKunjungan from "@/components/CardJamPuncakKunjungan";
import { CiExport } from "react-icons/ci";
import CardLaporanTersedia from "@/components/CardLaporanTersedia";
import LaporanHarianModal from "@/components/LaporanHarianModal";
import LaporanMingguanModal from "@/components/LaporanMingguanModal";
import LaporanBukuTamu from "@/components/LaporanBukuTamu";

export default function Laporan() {
  // 🔹 Tambahkan fungsi export di sini
  const handleExport = () => {
    const data = [
      ["Nama", "Departemen", "Tanggal", "Status"],
      ["John Doe", "Keuangan", "2025-05-30", "Hadir"],
      ["Jane Smith", "Marketing", "2025-05-30", "Tidak Hadir"],
      // Tambah data sesuai kebutuhan
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + data.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "laporan_kunjungan.csv");
    document.body.appendChild(link);
    link.click();
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const bukaModal = () => setIsModalOpen(true);
  const tutupModal = () => setIsModalOpen(false);

  const [modalMingguanOpen, setModalMingguanOpen] = useState(false);

  return (
    <div className="h-screen">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col bg-[#f6f9fc] overflow-y-auto max-h-screen">
          <HeaderDashboard title="Laporan" />
          {/* Tombol Print & Export */}
          <div className="px-6 py-4 flex justify-end gap-3">
            <Button
              onClick={() => window.print()}
              className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 shadow-sm bg-gray-100 text-gray-700 hover:bg-blue-100"
            >
              <IoMdPrint size={18} />
              Print Report
            </Button>

            <Button
              onClick={handleExport}
              className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 shadow-sm bg-green-100 text-green-700 hover:bg-green-200"
            >
              <CiExport size={18} />
              Export Data
            </Button>
          </div>

          {/* Konten Laporan */}
          <div className="px-6 pb-6 grid grid-cols-1  gap-6">
            <CardLaporan />
          </div>
        </div>
      </div>
    </div>
  );
}
