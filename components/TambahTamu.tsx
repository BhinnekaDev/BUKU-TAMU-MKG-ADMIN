"use client";

import { useState, ChangeEvent } from "react";
import { Guest } from "@/interfaces/GuestProps";
import { TambahTamuProps } from "@/interfaces/TambahTamuProps";

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
    stationDestination: "Meteorologi",
    signature: "",
  });

  const handleSignatureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          signature: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGuest: Guest = {
      id: Date.now(),
      ...formData,
    };
    onAdd(newGuest);
    setFormData({
      name: "",
      institution: "",
      jobTitle: "",
      purpose: "",
      visitDate: new Date().toISOString().slice(0, 16),
      status: "Sedang Ditinjau",
      stationDestination: "Meteorologi",
      signature: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 overflow-auto max-h-[90vh]">
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
            className="w-full border cursor-pointer px-4 py-2 rounded-lg text-sm"
            required
          />

          <select
            value={formData.stationDestination}
            onChange={(e) =>
              setFormData({ ...formData, stationDestination: e.target.value })
            }
            className="w-full cursor-pointer border px-4 py-2 rounded-lg text-sm"
            required
          >
            <option value="Meteorologi">Meteorologi</option>
            <option value="Klimatologi">Klimatologi</option>
            <option value="Geofisika">Geofisika</option>
          </select>

          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as Guest["status"],
              })
            }
            className="w-full cursor-pointer border px-4 py-2 rounded-lg text-sm"
            required
          >
            <option value="Sedang Ditinjau">Sedang Ditinjau</option>
            <option value="Diterima">Diterima</option>
            <option value="Ditolak">Ditolak</option>
          </select>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Foto Tanda Tangan
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleSignatureChange}
              className="text-sm w-full"
            />
            {formData.signature && (
              <img
                src={formData.signature}
                alt="Preview Tanda Tangan"
                className="mt-2 max-w-xs border border-gray-300 rounded"
              />
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 cursor-pointer hover:text-gray-800 text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-lg"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
