import { useEffect, useState } from "react";
import {
  isToday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  parseISO,
} from "date-fns";

export default function LaporanBukuTamu() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("hari");
  const [selectedTamu, setSelectedTamu] = useState(null);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">
        Laporan Buku Tamu
      </h2>

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
              <th className="border px-3 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="py-4 text-gray-500">
                Tidak ada data dalam periode ini
              </td>
            </tr>
            {/* <td className="border px-3 py-2">{index + 1}</td> */}
            {/* <td className="border px-3 py-2">{item.nama || "-"}</td>
                  <td className="border px-3 py-2">{item.Instansi || "-"}</td>
                  <td className="border px-3 py-2">{item.tanggal || "-"}</td>
                  <td className="border px-3 py-2">{item.status || "-"}</td> */}
            {/* <td className="border px-3 py-2">
              <button
                onClick={() => setSelectedTamu(item)}
                className="text-blue-600 hover:underline"
              >
                Detail
              </button>
            </td> */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
