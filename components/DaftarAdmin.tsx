"use client";

import { useAmbilDaftarAdmin } from "@/hooks/useAmbilDaftarAdmin";
import { useMemo, useState } from "react";

export default function KelolaAdminPage() {
  const {
    daftarAdmin = [],
    sedangMemuat,
    pesanKesalahan,
    totalCount,
    refetchAdmin,
  } = useAmbilDaftarAdmin();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(daftarAdmin.length / itemsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return daftarAdmin.slice(start, start + itemsPerPage);
  }, [currentPage, daftarAdmin]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, daftarAdmin.length);

  if (sedangMemuat) return <p>Memuat data admin...</p>;
  if (pesanKesalahan)
    return <p className="text-red-500 text-center">{pesanKesalahan}</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Daftar Admin ({totalCount || daftarAdmin.length})
        </h2>
        <button
          onClick={refetchAdmin}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
        >
          Muat Ulang
        </button>
      </div>

      {/* Daftar Admin */}
      <ul className="space-y-2">
        {currentData.map((admin) => (
          <li
            key={admin.ID_Admin}
            className="p-3 bg-white rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-gray-800">
                {admin.Nama_Depan_Admin} {admin.Nama_Belakang_Admin || ""}
              </p>
              <p className="text-sm text-gray-500">{admin.Email_Admin}</p>
              <p className="text-sm text-gray-600">
                {admin.Peran} —{" "}
                {admin.Stasiun ? admin.Stasiun.Nama_Stasiun : "-"}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Info & Navigasi Halaman */}
      {daftarAdmin.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
          <p className="text-sm text-gray-600">
            Menampilkan {startIndex} - {endIndex} dari {daftarAdmin.length}{" "}
            admin
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100"
            >
              Sebelumnya
            </button>

            {/* Nomor halaman */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 border rounded-lg text-sm ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
