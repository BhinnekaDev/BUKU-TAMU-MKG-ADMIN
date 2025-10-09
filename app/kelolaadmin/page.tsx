"use client";

import HeaderDashboard from "@/components/HeaderDashboard";
import Sidebar from "@/components/Sidebar";
import UpdateAdminModal from "@/components/UpdateAdminModal";
import { useAmbilDaftarAdmin } from "@/hooks/useAmbilDaftarAdmin";
import { Pencil } from "lucide-react";
import { useState } from "react";

export default function KelolaAdminPage() {
  const {
    daftarAdmin,
    sedangMemuat,
    pesanKesalahan,
    totalCount,
    refetchAdmin,
  } = useAmbilDaftarAdmin();

  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  return (
    <div className="flex h-screen">
      {/* Sidebar kiri */}
      <Sidebar />

      {/* Konten utama */}
      <div className="flex-1 flex flex-col bg-[#f6f9fc] overflow-y-auto">
        <HeaderDashboard title="Kelola Admin" />

        <div className="px-6 py-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1A6EB5] to-[#073CA4] mb-6">
            Daftar Admin ({totalCount})
          </h2>

          {/* Loading */}
          {sedangMemuat && (
            <p className="text-gray-600">Sedang memuat data admin...</p>
          )}

          {/* Error */}
          {pesanKesalahan && (
            <p className="text-red-500 bg-red-50 p-3 rounded-md">
              {pesanKesalahan}
            </p>
          )}

          {/* Data kosong */}
          {!sedangMemuat && !pesanKesalahan && daftarAdmin.length === 0 && (
            <p className="text-gray-600">Belum ada data admin.</p>
          )}

          {/* Tabel data admin */}
          {!sedangMemuat && daftarAdmin.length > 0 && (
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Peran
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Stasiun
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Dibuat Pada
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {daftarAdmin.map((admin) => (
                    <tr key={admin.ID_Admin}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {admin.Nama_Depan_Admin}{" "}
                        {admin.Nama_Belakang_Admin || ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {admin.Email_Admin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            admin.Peran === "Superadmin"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {admin.Peran}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {admin.Stasiun ? admin.Stasiun.Nama_Stasiun : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(admin.Created_At).toLocaleDateString("id-ID")}
                      </td>

                      {/* Tombol aksi */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedId(admin.ID_Admin);
                            setOpenModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mx-auto"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tombol refresh */}
          <div className="mt-6">
            <button
              onClick={refetchAdmin}
              className="px-4 py-2 bg-[#1A6EB5] hover:bg-[#155a91] text-white rounded-lg font-medium transition-all duration-200"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      </div>

      {/* Pop-up Update Admin */}
      <UpdateAdminModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          refetchAdmin(); // refresh daftar setelah update
        }}
        idAdmin={selectedId}
      />
    </div>
  );
}
