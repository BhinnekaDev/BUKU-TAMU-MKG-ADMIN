"use client";

import { useState } from "react";
import { Guest, TambahTamuProps } from "@/interfaces/TambahTamuProps";
// Gunakan path relatif sesuai lokasi file

export default function TambahTamuModal({
  isOpen,
  onClose,
  onAdd,
}: TambahTamuProps) {
  const [formData, setFormData] = useState<Omit<Guest, "id">>({
    name: "",
    institution: "",
    jobTitle: "",
    purpose: "",
    visitDate: new Date().toISOString().slice(0, 16),
    status: "Sedang Ditinjau",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGuest: Guest = {
      id: Date.now(), // Sementara, nanti bisa diganti pakai UUID atau dari backend
      ...formData,
    };
    onAdd(newGuest);
    setFormData({
      name: "",
      institution: "",
      jobTitle: "",
      purpose: "",
      visitDate: new Date().toISOString().slice(0, 16),
      status: "Diterima",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0   bg-opacity-40 backdrop-blur-md  flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Tambah Tamu Baru
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Nama"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border px-4 py-2 rounded-lg text-sm"
            required
          />
          <input
            type="text"
            placeholder="Instansi"
            value={formData.institution}
            onChange={(e) =>
              setFormData({ ...formData, institution: e.target.value })
            }
            className="w-full border px-4 py-2 rounded-lg text-sm"
            required
          />
          <input
            type="text"
            placeholder="Jabatan"
            value={formData.jobTitle}
            onChange={(e) =>
              setFormData({ ...formData, jobTitle: e.target.value })
            }
            className="w-full border px-4 py-2 rounded-lg text-sm"
            required
          />
          <input
            type="text"
            placeholder="Keperluan"
            value={formData.purpose}
            onChange={(e) =>
              setFormData({ ...formData, purpose: e.target.value })
            }
            className="w-full border px-4 py-2 rounded-lg text-sm"
            required
          />
          <input
            type="datetime-local"
            value={formData.visitDate}
            onChange={(e) =>
              setFormData({ ...formData, visitDate: e.target.value })
            }
            className="w-full border px-4 py-2 rounded-lg text-sm"
            required
          />
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as Guest["status"],
              })
            }
            className="w-full border px-4 py-2 rounded-lg text-sm"
            required
          >
            <option value="Sedang Ditinjau">Sedang Ditinjau</option>
            <option value="Diterima">Diterima</option>
            <option value="Ditolak">Ditolak</option>
          </select>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-lg"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
