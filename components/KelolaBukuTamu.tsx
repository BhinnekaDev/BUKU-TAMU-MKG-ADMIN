"use client";

import { useState, useMemo } from "react";
import { Pencil, Trash2, Plus, Search, Download } from "lucide-react";
import TambahTamu from "@/components/TambahTamu"; // sesuaikan path-nya
import { IoMdEye } from "react-icons/io";

interface Guest {
  id: number;
  name: string;
  institution: string;
  jobTitle: string;
  purpose: string;
  visitDate: string;
  status: "Sedang Ditinjau" | "Diterima" | "Ditolak"; // update status
}

function formatDateTime(dateStr: string) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function exportToCSV(data: Guest[]) {
  const header = [
    "Nama",
    "Instansi",
    "Jabatan",
    "Keperluan",
    "Waktu Kedatangan",
  ];
  const rows = data.map((guest) => [
    guest.name,
    guest.institution,
    guest.jobTitle,
    guest.purpose,
    formatDateTime(guest.visitDate),
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [header, ...rows].map((e) => e.map((v) => `"${v}"`).join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "data_buku_tamu.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const dummyGuests: Guest[] = [
  {
    id: 1,
    name: "Andi Saputra",
    institution: "Dinas Pendidikan",
    jobTitle: "Kepala Sub Bagian",
    purpose: "Rapat Koordinasi",
    visitDate: "2025-05-27T10:30",
    status: "Sedang Ditinjau", // update status
  },
  {
    id: 2,
    name: "Siti Nurlaila",
    institution: "Universitas Bengkulu",
    jobTitle: "Dosen",
    purpose: "Penelitian Iklim",
    visitDate: "2025-05-28T13:45",
    status: "Diterima", // update status
  },
];

export default function KelolaBukuTamu() {
  const [guests, setGuests] = useState<Guest[]>(dummyGuests);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("Semua");
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [selectedGuestForDetail, setSelectedGuestForDetail] =
    useState<Guest | null>(null);

  const institutions = useMemo(() => {
    const unique = new Set(guests.map((g) => g.institution));
    return ["Semua", ...Array.from(unique)];
  }, [guests]);

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch = guest.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesInstitution =
      selectedInstitution === "Semua" ||
      guest.institution === selectedInstitution;
    return matchesSearch && matchesInstitution;
  });

  const handleDelete = (id: number) => {
    const confirmed = confirm("Yakin ingin menghapus tamu ini?");
    if (confirmed) {
      setGuests((prev) => prev.filter((g) => g.id !== id));
    }
  };

  const handleGuestUpdate = (updatedGuest: Guest) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === updatedGuest.id ? updatedGuest : g))
    );
    setEditingGuest(null);
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddGuest = (guest: Guest) => {
    setGuests((prev) => [...prev, guest]);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full animate-fade-in mt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Daftar tamu</h3>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
              onClick={() => setIsAddModalOpen(true)} // buka modal tambah tamu
            >
              <Plus size={16} /> Tambah Tamu
            </button>
            {isAddModalOpen && (
              <TambahTamu
                isOpen={isAddModalOpen}
                onAdd={handleAddGuest}
                onClose={() => setIsAddModalOpen(false)}
              />
            )}

            <button
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition"
              onClick={() => exportToCSV(filteredGuests)}
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="relative w-full md:w-1/2">
            <Search
              className="absolute top-2.5 left-3 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Cari nama tamu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={selectedInstitution}
            onChange={(e) => setSelectedInstitution(e.target.value)}
            className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 text-sm"
          >
            {institutions.map((instansi) => (
              <option key={instansi} value={instansi}>
                {instansi}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Instansi</th>
                <th className="px-4 py-3">Jabatan</th>
                <th className="px-4 py-3">Keperluan</th>
                <th className="px-4 py-3">Waktu Kedatangan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length > 0 ? (
                filteredGuests.map((guest) => (
                  <tr
                    key={guest.id}
                    className="border-b border-gray-200 hover:bg-blue-50 transition"
                  >
                    <td className="px-4 py-3 font-medium">{guest.name}</td>
                    <td className="px-4 py-3">{guest.institution}</td>
                    <td className="px-4 py-3">{guest.jobTitle}</td>

                    <td className="px-4 py-3 max-w-xs break-words whitespace-normal">
                      {guest.purpose}
                    </td>
                    <td className="px-4 py-3">
                      {formatDateTime(guest.visitDate)}
                    </td>
                    <td className="px-4 py-3">{guest.status}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setSelectedGuestForDetail(guest)}
                          className="text-indigo-600 hover:text-indigo-800"
                          title="Lihat Detail"
                        >
                          <IoMdEye size={16} />
                        </button>
                        <button
                          onClick={() => setEditingGuest(guest)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(guest.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-gray-500 py-4 italic"
                  >
                    Tidak ada data tamu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal edit tamu */}
      {editingGuest && (
        <div className="fixed inset-0  bg-opacity-40 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 z-50">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Edit Tamu
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGuestUpdate(editingGuest);
              }}
              className="space-y-3"
            >
              <input
                type="text"
                value={editingGuest.name}
                onChange={(e) =>
                  setEditingGuest({ ...editingGuest, name: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-lg text-sm"
                placeholder="Nama"
                required
              />
              <input
                type="text"
                value={editingGuest.institution}
                onChange={(e) =>
                  setEditingGuest({
                    ...editingGuest,
                    institution: e.target.value,
                  })
                }
                className="w-full border px-4 py-2 rounded-lg text-sm"
                placeholder="Instansi"
                required
              />
              <input
                type="text"
                value={editingGuest.jobTitle}
                onChange={(e) =>
                  setEditingGuest({ ...editingGuest, jobTitle: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-lg text-sm"
                placeholder="Jabatan"
                required
              />
              <textarea
                value={editingGuest.purpose}
                onChange={(e) =>
                  setEditingGuest({ ...editingGuest, purpose: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-lg text-sm"
                placeholder="Keperluan"
                rows={3}
                required
              />
              <input
                type="datetime-local"
                value={editingGuest.visitDate}
                onChange={(e) =>
                  setEditingGuest({
                    ...editingGuest,
                    visitDate: e.target.value,
                  })
                }
                className="w-full border px-4 py-2 rounded-lg text-sm"
                required
              />
              <select
                value={editingGuest.status}
                onChange={(e) =>
                  setEditingGuest({
                    ...editingGuest,
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

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                  onClick={() => setEditingGuest(null)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal detail tamu */}
      {selectedGuestForDetail && (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 z-50">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Detail Tamu
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Nama:</strong> {selectedGuestForDetail.name}
              </p>
              <p>
                <strong>Instansi:</strong> {selectedGuestForDetail.institution}
              </p>
              <p>
                <strong>Jabatan:</strong> {selectedGuestForDetail.jobTitle}
              </p>
              <p>
                <strong>Keperluan:</strong> {selectedGuestForDetail.purpose}
              </p>
              <p>
                <strong>Waktu Kedatangan:</strong>{" "}
                {formatDateTime(selectedGuestForDetail.visitDate)}
              </p>
              <p>
                <strong>Status:</strong> {selectedGuestForDetail.status}
              </p>
            </div>
            <div className="flex justify-end pt-6">
              <button
                onClick={() => setSelectedGuestForDetail(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
