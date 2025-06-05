"use client";

import { useState, useMemo, ChangeEvent } from "react";
import { Pencil, Trash2, Plus, Search, Download } from "lucide-react";
import TambahTamu from "@/components/TambahTamu"; // sesuaikan path-nya
import { IoMdEye } from "react-icons/io";
import { Guest } from "@/interfaces/GuestProps";

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
    "Tujuan Stasiun",
  ];
  const rows = data.map((guest) => [
    guest.name,
    guest.institution,
    guest.jobTitle,
    guest.purpose,
    formatDateTime(guest.visitDate),
    guest.stationDestination,
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
    status: "Sedang Ditinjau",
    stationDestination: "Stasiun Gambir",
    signature: "",
  },
  {
    id: 2,
    name: "Siti Nurlaila",
    institution: "Universitas Bengkulu",
    jobTitle: "Dosen",
    purpose: "Penelitian Iklim",
    visitDate: "2025-05-28T13:45",
    status: "Diterima",
    stationDestination: "Stasiun Senen",
    signature: "",
  },
];

export default function KelolaBukuTamu() {
  const [guests, setGuests] = useState<Guest[]>(dummyGuests);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("Semua");
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [selectedGuestForDetail, setSelectedGuestForDetail] =
    useState<Guest | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  const handleAddGuest = (guest: Guest) => {
    setGuests((prev) => [...prev, guest]);
    setIsAddModalOpen(false);
  };

  // Fungsi untuk handle upload foto tanda tangan
  const handleSignatureChange = (
    e: ChangeEvent<HTMLInputElement>,
    setGuest: React.Dispatch<React.SetStateAction<Guest | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGuest(
          (prev) => prev && { ...prev, signature: reader.result as string }
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGuests = filteredGuests.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredGuests.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full animate-fade-in mt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Daftar tamu</h3>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
              onClick={() => setIsAddModalOpen(true)} // buka modal tambah tamu
            >
              <Plus size={16} /> Tambah Tamu
            </button>

            <button
              className="flex items-center cursor-pointer gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition"
              onClick={() => exportToCSV(filteredGuests)}
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* Filter Search & Institution */}
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
            className="w-full md:w-1/2 border border-gray-300 cursor-pointer rounded-lg px-4 py-2 text-sm"
          >
            {institutions.map((instansi) => (
              <option key={instansi} value={instansi}>
                {instansi}
              </option>
            ))}
          </select>
        </div>

        {/* Tabel tamu */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Instansi</th>
                <th className="px-4 py-3">Jabatan</th>
                <th className="px-4 py-3">Keperluan</th>
                <th className="px-4 py-3">Waktu Kedatangan</th>
                <th className="px-4 py-3">Tujuan Stasiun</th>
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
                    <td className="px-4 py-3">{guest.stationDestination}</td>
                    <td className="px-4 py-3">{guest.status}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setSelectedGuestForDetail(guest)}
                          className="text-indigo-600 cursor-pointer hover:text-indigo-800"
                          title="Lihat Detail"
                        >
                          <IoMdEye size={16} />
                        </button>
                        <button
                          onClick={() => setEditingGuest(guest)}
                          className="text-blue-600 cursor-pointer hover:text-blue-800"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(guest.id)}
                          className="text-red-600 cursor-pointer hover:text-red-800"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-10 text-gray-400 text-sm"
                  >
                    Tidak ada data tamu
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-3">
            <p className="text-sm text-gray-600">
              Menampilkan{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> -{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredGuests.length)}
              </span>{" "}
              dari <span className="font-medium">{filteredGuests.length}</span>{" "}
              tamu
            </p>

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm  bg-white text-blue-700 hover:bg-blue-50 hover:shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>

              <div className="flex gap-2 items-center">
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  const isActive = currentPage === pageNumber;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-9 h-9 rounded-md text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white shadow"
                          : "bg-white text-blue-700 border border-gray-300 hover:bg-blue-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm bg-white text-blue-700 hover:bg-blue-50 hover:shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal tambah tamu */}
      {isAddModalOpen && (
        <TambahTamu
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddGuest}
          isOpen
        />
      )}

      {/* Modal edit tamu */}
      {editingGuest && (
        <div className="fixed inset-0 backdrop-blur  bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <h3 className="text-lg font-semibold mb-4">Edit Data Tamu</h3>

            <GuestForm
              initialGuest={editingGuest}
              onCancel={() => setEditingGuest(null)}
              onSave={handleGuestUpdate}
            />
          </div>
        </div>
      )}

      {/* Modal detail tamu */}
      {selectedGuestForDetail && (
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <h3 className="text-lg font-semibold mb-4">Detail Data Tamu</h3>
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
                <strong>Tujuan Stasiun:</strong>{" "}
                {selectedGuestForDetail.stationDestination}
              </p>
              <p>
                <strong>Status:</strong> {selectedGuestForDetail.status}
              </p>
              <p>
                <strong>Foto Tanda Tangan:</strong>
              </p>
              {selectedGuestForDetail.signature ? (
                <img
                  src={selectedGuestForDetail.signature}
                  alt="Tanda Tangan"
                  className="border border-gray-300 rounded-md max-w-xs"
                />
              ) : (
                <p className="text-sm italic text-gray-400">
                  Belum ada tanda tangan
                </p>
              )}
            </div>

            <button
              onClick={() => setSelectedGuestForDetail(null)}
              className="mt-6 bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Form tambah/edit tamu, digabung supaya reusable
function GuestForm({
  initialGuest,
  onCancel,
  onSave,
}: {
  initialGuest: Guest;
  onCancel: () => void;
  onSave: (guest: Guest) => void;
}) {
  const [guest, setGuest] = useState<Guest>(initialGuest);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setGuest({ ...guest, [e.target.name]: e.target.value });
  };

  const handleSignatureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGuest((prev) => ({ ...prev, signature: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(guest);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[80vh] overflow-auto"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama
        </label>
        <input
          type="text"
          name="name"
          value={guest.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instansi
        </label>
        <input
          type="text"
          name="institution"
          value={guest.institution}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Jabatan
        </label>
        <input
          type="text"
          name="jobTitle"
          value={guest.jobTitle}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Keperluan
        </label>
        <textarea
          name="purpose"
          value={guest.purpose}
          onChange={handleChange}
          required
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Waktu Kedatangan
        </label>
        <input
          type="datetime-local"
          name="visitDate"
          value={guest.visitDate}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>

      {/* Input baru: Tujuan Stasiun */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tujuan Stasiun
        </label>
        <input
          type="text"
          name="stationDestination"
          value={guest.stationDestination}
          onChange={handleChange}
          required
          placeholder="Masukkan tujuan stasiun"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>

      {/* Upload Foto Tanda Tangan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Foto Tanda Tangan
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleSignatureChange}
          className="text-sm"
        />
        {guest.signature && (
          <img
            src={guest.signature}
            alt="Preview Tanda Tangan"
            className="mt-2 max-w-xs border border-gray-300 rounded"
          />
        )}
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Simpan
        </button>
      </div>
    </form>
  );
}
