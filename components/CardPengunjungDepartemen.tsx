import React from "react";

const dataDepartemen = [
  { nama: "Keuangan", total: 35 },
  { nama: "SDM", total: 22 },
  { nama: "Marketing", total: 18 },
  { nama: "Produksi", total: 42 },
  { nama: "IT", total: 27 },
];

export default function CardPengunjungDepartemen() {
  // cari nilai maksimum untuk skala progress bar
  const maxTotal = Math.max(...dataDepartemen.map((d) => d.total));

  return (
    <div className=" p-4">
      <div className="bg-white shadow-md rounded-xl p-6 space-y-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Pengunjung Berdasarkan Departemen
        </h2>

        <div className="space-y-4">
          {dataDepartemen.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>{item.nama}</span>
                <span>{item.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
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
