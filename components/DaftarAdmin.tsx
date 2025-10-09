"use client";

import { useAmbilDaftarAdmin } from "@/hooks/useAmbilDaftarAdmin";

export default function KelolaAdminPage() {
  const {
    daftarAdmin,
    sedangMemuat,
    pesanKesalahan,
    totalCount,
    refetchAdmin,
  } = useAmbilDaftarAdmin();

  if (sedangMemuat) return <p>Memuat data admin...</p>;
  if (pesanKesalahan) return <p className="text-red-500">{pesanKesalahan}</p>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">
        Daftar Admin ({totalCount})
      </h2>
      <ul className="space-y-2">
        {daftarAdmin.map((admin) => (
          <li
            key={admin.ID_Admin}
            className="p-3 bg-white rounded-lg shadow flex justify-between"
          >
            <div>
              <p className="font-medium">
                {admin.Nama_Depan_Admin} {admin.Nama_Belakang_Admin || ""}
              </p>
              <p className="text-sm text-gray-500">{admin.Email_Admin}</p>
              <p className="text-sm text-gray-600">
                {admin.Peran} —{" "}
                {admin.Stasiun ? admin.Stasiun.Nama_Stasiun : ""}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={refetchAdmin}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Muat Ulang
      </button>
    </div>
  );
}
