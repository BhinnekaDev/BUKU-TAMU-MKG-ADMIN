interface Guest {
  id: number;
  name: string;
  institution: string;
  jobTitle: string;
  purpose: string;
  visitDate: string;
  department: string;
  status: "Sedang Ditinjau" | "Diterima" | "Ditolak";
}

export default function LaporanBukuTamu({ guests = [] }: { guests?: Guest[] }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md bg-white p-4 mt-6">
      <table className="min-w-full text-left text-sm text-gray-800">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3">No.</th>
            <th className="px-4 py-3">Nama</th>
            <th className="px-4 py-3">Institusi</th>
            <th className="px-4 py-3">Jabatan</th>
            <th className="px-4 py-3">Tujuan</th>
            <th className="px-4 py-3">Tanggal</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {guests && guests.length > 0 ? (
            guests.map((guest, index) => (
              <tr
                key={guest.id}
                className={`border-b border-gray-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{guest.name}</td>
                <td className="px-4 py-3">{guest.institution}</td>
                <td className="px-4 py-3">{guest.jobTitle}</td>
                <td className="px-4 py-3">{guest.purpose}</td>
                <td className="px-4 py-3">{guest.visitDate}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-semibold ${
                      guest.status === "Sedang Ditinjau"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {guest.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center text-gray-500 italic py-4">
                Tidak ada data tamu.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
