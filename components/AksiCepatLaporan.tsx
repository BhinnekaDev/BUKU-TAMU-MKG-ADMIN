"use client";

import { Info } from "lucide-react";

export default function AksiCepatLaporan({
  selectedReport,
}: AksiCepatLaporanProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-6 w-full animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Detail Tamu</h3>

      {selectedReport ? (
        <div className="grid gap-2 text-sm text-gray-700">
          <p>
            <strong>Nama:</strong> {selectedReport.name}
          </p>
          <p>
            <strong>Instansi:</strong> {selectedReport.institution}
          </p>
          <p>
            <strong>Jabatan:</strong> {selectedReport.jobTitle}
          </p>
          <p>
            <strong>Keperluan:</strong> {selectedReport.purpose}
          </p>
          <p>
            <strong>Waktu Kunjungan:</strong> {selectedReport.visitDateTime}
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-gray-500 italic">
          <Info size={16} />
          Klik baris pada tabel untuk melihat detail tamu.
        </div>
      )}
    </div>
  );
}
