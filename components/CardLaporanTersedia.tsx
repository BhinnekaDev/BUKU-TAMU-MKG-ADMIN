import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import LaporanHarianModal from "./LaporanHarianModal";

type Laporan = {
  nama: string;
  deskripsi: string;
};

const laporanList: Laporan[] = [
  { nama: "Laporan Harian", deskripsi: "Statistik kunjungan hari ini" },
  { nama: "Laporan Mingguan", deskripsi: "Ringkasan kunjungan mingguan" },
  { nama: "Laporan Bulanan", deskripsi: "Analisis bulanan pengunjung" },
  {
    nama: "Laporan Departemen",
    deskripsi: "Distribusi pengunjung per departemen",
  },
  { nama: "Laporan Tujuan", deskripsi: "Tujuan kunjungan pengunjung" },
];

export default function CardLaporanTersedia() {
  const [selected, setSelected] = useState<Laporan | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (item: Laporan) => {
    setSelected(item);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelected(null);
  };

  return (
    <div className="w-full md:col-span-2 lg:col-span-3 p-4 max-w-full">
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Laporan yang Tersedia
        </h2>
        <p className="text-sm text-gray-500 mb-2">
          Laporan yang telah dikonfigurasi sebelumnya untuk akses cepat
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {laporanList.map((item, index) => (
            <li
              key={index}
              onClick={() => openModal(item)}
              className={`cursor-pointer border rounded-lg px-4 py-3 transition ${
                selected?.nama === item.nama
                  ? "bg-blue-100 border-blue-500"
                  : "hover:bg-blue-50"
              }`}
            >
              <p className="font-medium text-gray-700">{item.nama}</p>
              <p className="text-sm text-gray-500">{item.deskripsi}</p>
            </li>
          ))}
        </ul>
        {/* Modal Khusus */}
        {selected?.nama === "Laporan Harian" && (
          <LaporanHarianModal isOpen={isOpen} onClose={closeModal} />
        )}
      </div>

      <div className="mt-4 text-right">
        <button
          onClick={closeModal}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
