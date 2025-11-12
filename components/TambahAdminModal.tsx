"use client";

import { useTambahkanAdmin } from "@/hooks/useTambahkanAdmin";
import { Eye, EyeOff, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

interface TambahAdminModalProps {
  open: boolean;
  onClose: () => void;
  refetchAdmin: () => void;
}

interface Stasiun {
  ID_Stasiun: string;
  Nama_Stasiun: string;
}

export default function TambahAdminModal({
  open,
  onClose,
  refetchAdmin,
}: TambahAdminModalProps) {
  const { tambahkanAdmin, sedangMengirim, pesanKesalahan, pesanSukses } =
    useTambahkanAdmin();

  const [namaDepan, setNamaDepan] = useState("");
  const [namaBelakang, setNamaBelakang] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [peran, setPeran] = useState<"Admin" | "Superadmin">("Admin");
  const [idStasiun, setIdStasiun] = useState("");
  const [daftarStasiun, setDaftarStasiun] = useState<Stasiun[]>([]);
  const [memuatStasiun, setMemuatStasiun] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!open) return;
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
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await tambahkanAdmin({
        nama_depan: namaDepan,
        nama_belakang: namaBelakang || "",
        email,
        password,
        confirmPassword,
        peran,
        id_stasiun: peran === "Admin" ? idStasiun : undefined,
      });

      if (refetchAdmin) refetchAdmin();
      onClose();
    } catch (err) {
      console.error("Gagal menambahkan admin:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-lg relative animate-[fadeIn_0.2s_ease-out]"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Tombol tutup */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-2 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-center text-gray-800">
            Tambah Admin Baru
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Nama Depan
              </label>
              <input
                type="text"
                value={namaDepan}
                onChange={(e) => setNamaDepan(e.target.value)}
                required
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Nama Belakang
              </label>
              <input
                type="text"
                value={namaBelakang}
                onChange={(e) => setNamaBelakang(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 outline-none"
            />
          </div>

          {/* 👁️ Password & Konfirmasi Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Konfirmasi Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Peran</label>
              <select
                value={peran}
                onChange={(e) =>
                  setPeran(e.target.value as "Admin" | "Superadmin")
                }
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 outline-none"
              >
                <option value="Admin">Admin</option>
                <option value="Superadmin">Superadmin</option>
              </select>
            </div>

            {peran === "Admin" && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Stasiun
                </label>
                <select
                  value={idStasiun}
                  onChange={(e) => setIdStasiun(e.target.value)}
                  required
                  disabled={memuatStasiun}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 outline-none"
                >
                  {memuatStasiun ? (
                    <option>Memuat...</option>
                  ) : (
                    <>
                      <option value="">-- Pilih Stasiun --</option>
                      {daftarStasiun.map((stasiun) => (
                        <option
                          key={stasiun.ID_Stasiun}
                          value={stasiun.ID_Stasiun}
                        >
                          {stasiun.Nama_Stasiun}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            )}
          </div>

          {/* Pesan feedback */}
          {pesanKesalahan && (
            <p className="text-red-500 text-sm">{pesanKesalahan}</p>
          )}
          {pesanSukses && (
            <p className="text-green-600 text-sm">{pesanSukses}</p>
          )}

          {/* Tombol kirim */}
          <button
            type="submit"
            disabled={sedangMengirim}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition disabled:bg-gray-400"
          >
            {sedangMengirim ? "Menyimpan..." : "Tambah Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
