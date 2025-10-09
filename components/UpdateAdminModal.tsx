"use client";

import { useAmbilDaftarAdmin } from "@/hooks/useAmbilDaftarAdmin";
import { useUpdateAdmin } from "@/hooks/useUpdateAdmin";
import { X } from "lucide-react";
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
    () => daftarAdmin.find((a) => a.ID_Admin === idAdmin),
    [daftarAdmin, idAdmin]
  );

  const [namaDepan, setNamaDepan] = useState("");
  const [namaBelakang, setNamaBelakang] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);

  useEffect(() => {
    if (adminDipilih) {
      setNamaDepan(adminDipilih.Nama_Depan_Admin || "");
      setNamaBelakang(adminDipilih.Nama_Belakang_Admin || "");
      setPreviewFoto(adminDipilih.Foto_Admin || null);
    }
  }, [adminDipilih]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateAdmin({
        id_admin: idAdmin,
        nama_depan: namaDepan || undefined,
        nama_belakang: namaBelakang || undefined,
        password: password || undefined,
        confirmPassword: confirmPassword || undefined,
        foto,
      });
    } catch (err) {
      console.error("Update admin gagal:", err);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
      setPreviewFoto(URL.createObjectURL(file)); // preview langsung
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-center mb-4">Update Admin</h2>

        {adminDipilih ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nama Depan</label>
              <input
                type="text"
                value={namaDepan}
                onChange={(e) => setNamaDepan(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Nama Belakang</label>
              <input
                type="text"
                value={namaBelakang}
                onChange={(e) => setNamaBelakang(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password Baru</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Konfirmasi Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Foto Admin</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full mt-1"
              />
              {previewFoto && (
                <Image
                  src={previewFoto}
                  alt="Preview Foto"
                  width={96}
                  height={96}
                  className="mt-3 w-24 h-24 object-cover rounded-full border"
                />
              )}
            </div>

            {pesanKesalahan && (
              <p className="text-red-500 text-sm">{pesanKesalahan}</p>
            )}
            {pesanBerhasil && (
              <p className="text-green-600 text-sm">{pesanBerhasil}</p>
            )}

            <button
              type="submit"
              disabled={sedangMemuat}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition disabled:bg-gray-400"
            >
              {sedangMemuat ? "Memperbarui..." : "Simpan Perubahan"}
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-600">
            Data admin tidak ditemukan...
          </p>
        )}
      </div>
    </div>
  );
}
