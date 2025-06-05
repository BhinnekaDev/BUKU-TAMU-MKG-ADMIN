import { useState } from "react";

interface Guest {
  id: number;
  name: string;
  institution: string;
  jobTitle: string;
  purpose: string;
  visitDate: string;
  department: string;
  status: "Sedang Ditinjau" | "Diterima" | "Ditolak";
  tujuanStasiun: string;
  tandaTangan?: string;
}

const ITEMS_PER_PAGE = 10;

export default function LaporanBukuTamu({ guests = [] }: { guests?: Guest[] }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Hitung total halaman
  const totalPages = Math.ceil(guests.length / ITEMS_PER_PAGE);

  // Ambil data tamu yang akan ditampilkan di halaman sekarang
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentGuests = guests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handler next page
  const nextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  // Handler previous page
  const prevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-lg shadow-md bg-white p-4 mt-6">
        <table className="min-w-full text-left text-sm text-gray-800">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">No.</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Institusi</th>
              <th className="px-4 py-3">Jabatan</th>
              <th className="px-4 py-3">Tujuan</th>
              <th className="px-4 py-3">Tujuan Stasiun</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tanda Tangan</th>
            </tr>
          </thead>
          <tbody>
            {currentGuests.length > 0 ? (
              currentGuests.map((guest, index) => (
                <tr
                  key={guest.id}
                  className={`border-b border-gray-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3">{startIndex + index + 1}</td>
                  <td className="px-4 py-3">{guest.name}</td>
                  <td className="px-4 py-3">{guest.institution}</td>
                  <td className="px-4 py-3">{guest.jobTitle}</td>
                  <td className="px-4 py-3">{guest.purpose}</td>
                  <td className="px-4 py-3">{guest.tujuanStasiun}</td>
                  <td className="px-4 py-3">{guest.visitDate}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-semibold ${
                        guest.status === "Sedang Ditinjau"
                          ? "bg-green-100 text-green-700"
                          : guest.status === "Diterima"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {guest.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {guest.tandaTangan ? (
                      <img
                        src={guest.tandaTangan}
                        alt="Tanda Tangan"
                        className="h-10 w-24 object-contain border rounded"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="text-center text-gray-500 italic py-4"
                >
                  Tidak ada data tamu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md border ${
              currentPage === 1
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-blue-600 border-blue-600 hover:bg-blue-100"
            }`}
          >
            Previous
          </button>
          <span>
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md border ${
              currentPage === totalPages
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-blue-600 border-blue-600 hover:bg-blue-100"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
