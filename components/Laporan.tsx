"use client";

import { useState } from "react";
import {
  isToday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  parseISO,
} from "date-fns";

interface Tamu {
  id: number;
  nama: string;
  instansi: string;
  tanggal: string; // ISO string
  status: string;
  tujuanStasiun: string;
  tandaTangan?: string; // URL data image base64
}

export default function LaporanBukuTamu() {
  const [data, setData] = useState<Tamu[]>([]);
  const [filter, setFilter] = useState("hari");
  const [form, setForm] = useState({
    nama: "",
    instansi: "",
    tanggal: "",
    status: "Sedang Ditinjau",
    tujuanStasiun: "",
    tandaTangan: "",
  });

  // Fungsi handle input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Upload dan convert tanda tangan ke base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, tandaTangan: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit form, tambah data baru
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.nama ||
      !form.instansi ||
      !form.tanggal ||
      !form.status ||
      !form.tujuanStasiun
    ) {
      alert("Mohon lengkapi semua field.");
      return;
    }

    const newTamu: Tamu = {
      id: Date.now(),
      nama: form.nama,
      instansi: form.instansi,
      tanggal: form.tanggal,
      status: form.status,
      tujuanStasiun: form.tujuanStasiun,
      tandaTangan: form.tandaTangan,
    };

    setData((prev) => [newTamu, ...prev]);

    // Reset form
    setForm({
      nama: "",
      instansi: "",
      tanggal: "",
      status: "Sedang Ditinjau",
      tujuanStasiun: "",
      tandaTangan: "",
    });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">
        Laporan Buku Tamu
      </h2>

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="nama"
            placeholder="Nama"
            value={form.nama}
            onChange={handleChange}
            className="border rounded-md px-3 py-2"
            required
          />
          <input
            type="text"
            name="instansi"
            placeholder="Instansi"
            value={form.instansi}
            onChange={handleChange}
            className="border rounded-md px-3 py-2"
            required
          />
          <input
            type="datetime-local"
            name="tanggal"
            value={form.tanggal}
            onChange={handleChange}
            className="border rounded-md px-3 py-2"
            required
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded-md px-3 py-2"
            required
          >
            <option value="Sedang Ditinjau">Sedang Ditinjau</option>
            <option value="Diterima">Diterima</option>
            <option value="Ditolak">Ditolak</option>
          </select>
          <input
            type="text"
            name="tujuanStasiun"
            placeholder="Tujuan Stasiun"
            value={form.tujuanStasiun}
            onChange={handleChange}
            className="border rounded-md px-3 py-2"
            required
          />
          <div>
            <label className="block mb-1 font-semibold">
              Foto Tanda Tangan
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border rounded-md px-3 py-1"
            />
            {form.tandaTangan && (
              <img
                src={form.tandaTangan}
                alt="Tanda Tangan Preview"
                className="mt-2 w-40 h-20 object-contain border"
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Tambah Data Tamu
        </button>
      </form>

      {/* Filter Button */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["hari", "minggu", "bulan", "tahun"].map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-md border transition ${
              filter === key
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
            }`}
          >
            {key === "hari" && "Hari Ini"}
            {key === "minggu" && "Minggu Ini"}
            {key === "bulan" && "Bulan Ini"}
            {key === "tahun" && "Tahun Ini"}
          </button>
        ))}
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border text-sm text-center">
          <thead className="bg-blue-100 text-blue-900 font-semibold">
            <tr>
              <th className="border px-3 py-2">No</th>
              <th className="border px-3 py-2">Nama</th>
              <th className="border px-3 py-2">Instansi</th>
              <th className="border px-3 py-2">Tanggal</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Tujuan Stasiun</th>
              <th className="border px-3 py-2">Tanda Tangan</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-4 text-gray-500">
                  Tidak ada data dalam periode ini
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-blue-50 transition"
                >
                  <td className="border px-3 py-2">{index + 1}</td>
                  <td className="border px-3 py-2">{item.nama}</td>
                  <td className="border px-3 py-2">{item.instansi}</td>
                  <td className="border px-3 py-2">
                    {new Date(item.tanggal).toLocaleString("id-ID", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="border px-3 py-2">{item.status}</td>
                  <td className="border px-3 py-2">{item.tujuanStasiun}</td>
                  <td className="border px-3 py-2">
                    {item.tandaTangan ? (
                      <img
                        src={item.tandaTangan}
                        alt="Tanda Tangan"
                        className="mx-auto h-12 object-contain"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
