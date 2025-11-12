"use client";

import { useAmbilDaftarAdmin } from "@/hooks/useAmbilDaftarAdmin";
import { useUpdateAdmin } from "@/hooks/useUpdateAdmin";
import { Eye, EyeOff, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

interface UpdateAdminModalProps {
  open: boolean;
  onClose: () => void;
  idAdmin: string;
}

export default function UpdateAdminModal({
  open,
  onClose,
  idAdmin,
}: UpdateAdminModalProps) {
  const { updateAdmin, sedangMemuat, pesanKesalahan, pesanBerhasil } =
    useUpdateAdmin();
  const { daftarAdmin } = useAmbilDaftarAdmin();

  const adminDipilih = useMemo(
    () => daftarAdmin?.find((a) => a.ID_Admin === idAdmin),
    [daftarAdmin, idAdmin]
  );

  const [namaDepan, setNamaDepan] = useState("");
  const [namaBelakang, setNamaBelakang] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [foto, setFoto] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (adminDipilih) {
      setNamaDepan(adminDipilih.Nama_Depan_Admin || "");
      setNamaBelakang(adminDipilih.Nama_Belakang_Admin || "");
      setPreviewFoto(adminDipilih.Foto_Admin || null);
    }
  }, [open, adminDipilih]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateAdmin({
      id_admin: idAdmin,
      nama_depan: namaDepan || undefined,
      nama_belakang: namaBelakang || undefined,
      password: password || undefined,
      confirmPassword: confirmPassword || undefined,
      foto,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-6 md:px-0">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg md:max-w-md p-6 relative animate-fadeIn overflow-y-auto max-h-[90vh]"
        style={{ animation: "fadeIn 0.2s ease-in-out" }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl md:text-2xl font-semibold text-center mb-5 text-gray-800">
          Update Admin
        </h2>

        {adminDipilih ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Depan */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Nama Depan
              </label>
              <input
                type="text"
                value={namaDepan}
                onChange={(e) => setNamaDepan(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 outline-none"
              />
            </div>

            {/* Nama Belakang */}
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

            {/* Password */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700">
                Password Baru
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Konfirmasi Password */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700">
                Konfirmasi Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Foto Admin */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Foto Admin
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full mt-1 text-sm"
              />
              {previewFoto && (
                <div className="mt-3 flex justify-center">
                  <Image
                    src={previewFoto}
                    alt="Preview Foto"
                    width={100}
                    height={100}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full border"
                  />
                </div>
              )}
            </div>

            {/* Notifikasi */}
            {pesanKesalahan && (
              <p className="text-red-500 text-sm text-center">
                {pesanKesalahan}
              </p>
            )}
            {pesanBerhasil && (
              <p className="text-green-600 text-sm text-center">
                {pesanBerhasil}
              </p>
            )}

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={sedangMemuat}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition disabled:bg-gray-400"
            >
              {sedangMemuat ? "Memperbarui..." : "Simpan Perubahan"}
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-600 mt-4">
            Data admin tidak ditemukan...
          </p>
        )}
      </div>
    </div>
  );
}
