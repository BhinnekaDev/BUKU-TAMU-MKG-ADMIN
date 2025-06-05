import React from "react";

const dataTujuan = [
  { nama: "Rapat", total: 30 },
  { nama: "Kunjungan Dinas", total: 18 },
  { nama: "Magang", total: 12 },
  { nama: "Studi Banding", total: 25 },
  { nama: "Lainnya", total: 8 },
];

export default function CardPengunjungTujuan() {
  const maxTotal = Math.max(...dataTujuan.map((item) => item.total));

  return (
    <div className="p-4">
      <div className="bg-white shadow-md rounded-xl p-6 space-y-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Pengunjung Berdasarkan Tujuan
        </h2>

        <div className="space-y-4">
          {dataTujuan.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>{item.nama}</span>
                <span>{item.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-900 h-2 rounded-full transition-all"
                  style={{
                    width: `${(item.total / maxTotal) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
