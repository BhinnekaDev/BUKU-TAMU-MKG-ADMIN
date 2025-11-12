"use client";

import HeaderDashboard from "@/components/HeaderDashboard";
import Sidebar from "@/components/Sidebar";
import TambahAdminModal from "@/components/TambahAdminModal";
import UpdateAdminModal from "@/components/UpdateAdminModal";
import { useAmbilDaftarAdmin } from "@/hooks/useAmbilDaftarAdmin";
import { Pencil, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface Stasiun {
  ID_Stasiun: string;
  Nama_Stasiun: string;
}

export default function KelolaAdminPage() {
  const [search, setSearch] = useState("");
  const [filterPeran, setFilterPeran] = useState("");
  const [filterStasiunId, setFilterStasiunId] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  const {
    daftarAdmin = [],
    sedangMemuat,
    pesanKesalahan,
    totalCount,
    refetchAdmin,
  } = useAmbilDaftarAdmin(search, filterPeran, filterStasiunId);

  const [openModal, setOpenModal] = useState(false);
  const [openTambahModal, setOpenTambahModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  const [daftarStasiun, setDaftarStasiun] = useState<Stasiun[]>([]);
  const [memuatStasiun, setMemuatStasiun] = useState(false);

  useEffect(() => {
    const fetchStasiun = async () => {
      try {
        setMemuatStasiun(true);
        const res = await fetch(
          "https://buku-tamu-mkg-database.vercel.app/api/pengunjung"
        );
        const data = await res.json();
        if (data?.data) setDaftarStasiun(data.data);
      } catch (err) {
        console.error("Gagal memuat stasiun:", err);
      } finally {
        setMemuatStasiun(false);
      }
    };
    fetchStasiun();
  }, []);

  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalCount);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const handleFilter = () => {
    setPage(1);
    refetchAdmin();
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-[#f6f9fc] overflow-y-auto">
        <HeaderDashboard title="Kelola Admin" />

        <div className="px-6 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1A6EB5] to-[#073CA4]">
              Daftar Admin ({totalCount || daftarAdmin.length})
            </h2>

            <button
              onClick={() => setOpenTambahModal(true)}
              className="flex items-center gap-2 bg-[#1A6EB5] hover:bg-[#155a91] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
            >
              <Plus size={18} />
              Tambah Admin
            </button>
          </div>

          {/* Filter & Search */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari admin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 border rounded-lg text-sm w-56"
              />
            </div>

            <select
              value={filterPeran}
              onChange={(e) => setFilterPeran(e.target.value)}
              className="border px-3 py-2 rounded-lg text-sm"
            >
              <option value="">Semua Peran</option>
              <option value="Admin">Admin</option>
              <option value="Superadmin">Superadmin</option>
            </select>

            {/* 🔹 Dropdown Stasiun */}
            <select
              value={filterStasiunId}
              onChange={(e) => setFilterStasiunId(e.target.value)}
              className="border px-3 py-2 rounded-lg text-sm w-52"
              disabled={memuatStasiun}
            >
              <option value="">Semua Stasiun</option>
              {daftarStasiun.map((stasiun) => (
                <option key={stasiun.ID_Stasiun} value={stasiun.ID_Stasiun}>
                  {stasiun.Nama_Stasiun}
                </option>
              ))}
            </select>

            <button
              onClick={handleFilter}
              className="bg-[#1A6EB5] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#155a91]"
            >
              Terapkan
            </button>
          </div>

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
            <>
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
                          {admin.Stasiun?.Nama_Stasiun || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(admin.Created_At).toLocaleDateString(
                            "id-ID"
                          )}
                        </td>
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

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
                <p className="text-sm text-gray-600">
                  Menampilkan {startIndex} - {endIndex} dari {totalCount} admin
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100"
                  >
                    Sebelumnya
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-1 border rounded-lg text-sm ${
                        page === i + 1
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal Update Admin */}
      <UpdateAdminModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          refetchAdmin();
        }}
        idAdmin={selectedId}
      />

      {/* Modal Tambah Admin */}
      <TambahAdminModal
        open={openTambahModal}
        onClose={() => {
          setOpenTambahModal(false);
          refetchAdmin();
        }}
        refetchAdmin={refetchAdmin}
      />
    </div>
  );
}
