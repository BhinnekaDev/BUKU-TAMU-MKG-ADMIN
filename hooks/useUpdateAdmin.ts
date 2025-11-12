import { useState } from "react";

interface UpdateAdminPayload {
  id_admin: string;
  nama_depan?: string;
  nama_belakang?: string;
  password?: string;
  confirmPassword?: string;
  foto?: File | null;
}

interface ApiResponse {
  message: string;
  data?: any;
}

export function useUpdateAdmin() {
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanKesalahan, setPesanKesalahan] = useState<string | null>(null);
  const [pesanBerhasil, setPesanBerhasil] = useState<string | null>(null);

  // --- Validasi token dari sessionStorage ---
  const validateToken = () => {
    const tokenAkses = sessionStorage.getItem("access_token");
    const userId = sessionStorage.getItem("user_id");

    if (!tokenAkses || !userId) {
      throw new Error("Akses ditolak. Silakan login ulang.");
    }

    return { tokenAkses, userId };
  };

  // --- Fungsi utama update admin ---
  const updateAdmin = async (payload: UpdateAdminPayload) => {
    setSedangMemuat(true);
    setPesanKesalahan(null);
    setPesanBerhasil(null);

    try {
      if (!payload.id_admin) {
        throw new Error("ID Admin wajib disertakan.");
      }

      const { tokenAkses, userId } = validateToken();

      const formData = new FormData();
      if (payload.nama_depan !== undefined)
        formData.append("nama_depan", payload.nama_depan);
      if (payload.nama_belakang !== undefined)
        formData.append("nama_belakang", payload.nama_belakang);
      if (payload.password !== undefined)
        formData.append("password", payload.password);
      if (payload.confirmPassword !== undefined)
        formData.append("confirmPassword", payload.confirmPassword);
      if (payload.foto) formData.append("foto", payload.foto);

      const response = await fetch(
        `https://buku-tamu-mkg-database.vercel.app/api/admin/update-admin`,
        {
          method: "PUT",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${tokenAkses}`,
            user_id: userId,
            id_admin: payload.id_admin,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        let errorMsg = `HTTP ${response.status}`;
        try {
          const err = await response.json();
          errorMsg = err.message || err.error || errorMsg;
        } catch {
          const errText = await response.text();
          errorMsg = errText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const result: ApiResponse = await response.json();
      setPesanBerhasil(result.message || "Berhasil memperbarui admin.");
      return result;
    } catch (err: any) {
      console.error("Gagal update admin:", err);
      setPesanKesalahan(err.message || "Terjadi kesalahan saat update admin.");
      throw err;
    } finally {
      setSedangMemuat(false);
    }
  };

  return {
    updateAdmin,
    sedangMemuat,
    pesanKesalahan,
    pesanBerhasil,
  };
}
