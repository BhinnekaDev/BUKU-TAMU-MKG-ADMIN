"use client";

import React, { useState } from "react";
import LaporanBukuTamu from "@/components/LaporanBukuTamu"; // sesuaikan path-nya

const dummyGuests: Guest[] = [
  {
    id: 1,
    name: "Budi Santoso",
    institution: "UNPAD",
    jobTitle: "Dosen",
    purpose: "Studi Lapangan",
    visitDate: "2025-06-01",
    department: "Teknik",
    status: "Sedang Ditinjau",
  },
  {
    id: 2,
    name: "Siti Aminah",
    institution: "BMKG",
    jobTitle: "Peneliti",
    purpose: "Koordinasi Data Cuaca",
    visitDate: "2025-06-01",
    department: "Klimatologi",
    status: "Diterima",
  },
  {
    id: 3,
    name: "Ahmad Yani",
    institution: "Meteorotech",
    jobTitle: "Engineer",
    purpose: "Presentasi Produk",
    visitDate: "2025-05-30",
    department: "Instrumentasi",
    status: "Ditolak",
  },
];

const types = [
  { value: "all", label: "Semua" },
  { value: "monthly", label: "Bulanan" },
  { value: "yearly", label: "Tahunan" },
];

const statuses = [
  { value: "all", label: "Semua Status" },
  { value: "Sedang Ditinjau", label: "Sedang Ditinjau" },
  { value: "Diterima", label: "Diterima" },
  { value: "Ditolak", label: "Ditolak" },
];

export default function LaporanDenganFilter() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedPurpose, setSelectedPurpose] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const filteredGuests = dummyGuests.filter((guest) => {
    const date = new Date(guest.visitDate);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const matchType =
      selectedType === "all" ||
      (selectedType === "monthly" &&
        month === currentMonth &&
        year === currentYear) ||
      (selectedType === "yearly" && year === currentYear);

    const matchDept =
      selectedDepartment === "all" || guest.department === selectedDepartment;

    const matchPurpose =
      selectedPurpose === "all" || guest.purpose === selectedPurpose;

    const matchStatus =
      selectedStatus === "all" || guest.status === selectedStatus;

    return matchType && matchDept && matchPurpose && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Tipe Laporan */}
        <div className="space-y-2 min-w-0">
          <p className="text-sm font-semibold text-gray-600">Tipe Laporan</p>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-3 py-2 rounded-2xl text-sm font-medium transition-all duration-200 shadow-sm ${
                  selectedType === type.value
                    ? "bg-blue-600 text-white ring-2 ring-blue-500"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Departemen */}
        <div className="space-y-2 min-w-0">
          <p className="text-sm font-semibold text-gray-600">Departemen</p>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700"
          >
            <option value="all">Semua Departemen</option>
            <option value="Teknik">Teknik</option>
            <option value="Klimatologi">Klimatologi</option>
            <option value="Instrumentasi">Instrumentasi</option>
          </select>
        </div>

        {/* Tujuan */}
        <div className="space-y-2 min-w-0">
          <p className="text-sm font-semibold text-gray-600">
            Tujuan Kunjungan
          </p>
          <select
            value={selectedPurpose}
            onChange={(e) => setSelectedPurpose(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700"
          >
            <option value="all">Semua Tujuan</option>
            <option value="Studi Lapangan">Studi Lapangan</option>
            <option value="Koordinasi Data Cuaca">Koordinasi Data Cuaca</option>
            <option value="Presentasi Produk">Presentasi Produk</option>
          </select>
        </div>

        {/* Status */}
        <div className="space-y-2 min-w-0">
          <p className="text-sm font-semibold text-gray-600">Status</p>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel Buku Tamu */}
      <LaporanBukuTamu guests={filteredGuests} />
    </div>
  );
}
