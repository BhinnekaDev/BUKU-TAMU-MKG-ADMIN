import React from "react";

const dataJam = [
  { jam: "08:00", total: 5 },
  { jam: "09:00", total: 12 },
  { jam: "10:00", total: 18 },
  { jam: "11:00", total: 22 },
  { jam: "12:00", total: 15 },
  { jam: "13:00", total: 10 },
  { jam: "14:00", total: 8 },
  { jam: "15:00", total: 4 },
];

export default function CardJamPuncakKunjungan() {
  const maxTotal = Math.max(...dataJam.map((item) => item.total));

  return (
    <div className="p-4">
      <div className="bg-white shadow-md rounded-xl p-6 space-y-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Jam Puncak Kunjungan
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Distribusi pengunjung sepanjang hari
        </p>

        <div className="space-y-3">
          {dataJam.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm text-gray-700 font-medium">
                <span>{item.jam}</span>
                <span>{item.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-400 h-2 rounded-full transition-all"
                  style={{ width: `${(item.total / maxTotal) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
