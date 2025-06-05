"use client";

import { Dialog } from "@headlessui/react";
import React, { useEffect, useState } from "react";

type Pengunjung = {
  id: number;
  nama: string;
  waktuCheckIn: string;
  waktuCheckOut: string | null;
  status: "check-in" | "check-out";
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LaporanHarianModal({ isOpen, onClose }: Props) {
  // Dummy data awal pengunjung hari ini
  const [pengunjung, setPengunjung] = useState<Pengunjung[]>([
    {
      id: 1,
      nama: "Andi",
      waktuCheckIn: "08:10",
      waktuCheckOut: null,
      status: "check-in",
    },
    {
      id: 2,
      nama: "Budi",
      waktuCheckIn: "09:15",
      waktuCheckOut: "17:00",
      status: "check-out",
    },
    {
      id: 3,
      nama: "Citra",
      waktuCheckIn: "10:00",
      waktuCheckOut: null,
      status: "check-in",
    },
  ]);

  // Simulasi update status check-out real-time setiap 15 detik (dummy)
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setPengunjung((prev) => {
        // Cari satu pengunjung check-in tanpa waktu check-out
        const idx = prev.findIndex(
          (p) => p.status === "check-in" && !p.waktuCheckOut
        );
        if (idx === -1) return prev;

        // Update status dan waktu check-out
        const updated = [...prev];
        const now = new Date();
        const jam = now.getHours().toString().padStart(2, "0");
        const menit = now.getMinutes().toString().padStart(2, "0");
        updated[idx] = {
          ...updated[idx],
          waktuCheckOut: `${jam}:${menit}`,
          status: "check-out",
        };
        return updated;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Hitung jumlah pengunjung yang datang hari ini (check-in)
  const totalPengunjung = pengunjung.length;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg max-h-[80vh] overflow-auto">
          <Dialog.Title className="text-2xl font-semibold text-gray-800 mb-4">
            Laporan Harian - Real-Time
          </Dialog.Title>

          <p className="mb-4 text-gray-700">
            Menyajikan jumlah pengunjung yang datang hari ini, rincian jam
            kedatangan, serta status check-in dan check-out secara real-time.
          </p>

          <p className="mb-6 font-semibold text-lg text-blue-600">
            Total Pengunjung Hari Ini: {totalPengunjung}
          </p>

          <table className="w-full border border-gray-300 rounded-lg text-left text-sm mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-r">Nama</th>
                <th className="px-4 py-2 border-r">Check-In</th>
                <th className="px-4 py-2 border-r">Check-Out</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {pengunjung.map(
                ({ id, nama, waktuCheckIn, waktuCheckOut, status }) => (
                  <tr key={id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-2 border-r">{nama}</td>
                    <td className="px-4 py-2 border-r">{waktuCheckIn}</td>
                    <td className="px-4 py-2 border-r">
                      {waktuCheckOut || "-"}
                    </td>
                    <td
                      className={`px-4 py-2 font-semibold ${
                        status === "check-in"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {status === "check-in" ? "Check-In" : "Check-Out"}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-400"
            >
              Tutup
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
