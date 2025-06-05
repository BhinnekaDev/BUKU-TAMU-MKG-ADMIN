"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", kunjungan: 6 },
  { name: "Tue", kunjungan: 8 },
  { name: "Wed", kunjungan: 12 },
  { name: "Thu", kunjungan: 5 },
  { name: "Fri", kunjungan: 10 },
  { name: "Sat", kunjungan: 11 },
  { name: "Sun", kunjungan: 9 },
];

export default function ActivityChart() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Activities</h3>
        <select className="border border-gray-300 rounded px-2 py-1 text-sm">
          <option>Januari</option>
          <option>Februari</option>
          {/* Tambahkan bulan lainnya jika perlu */}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="kunjungan" fill="#1670ba" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
