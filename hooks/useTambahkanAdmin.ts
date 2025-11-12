import { useCallback, useState } from "react";

interface TambahAdminResponse {
  message: string;
  id: string;
  email: string;
  peran: string;
}

export function useTambahkanAdmin() {
  const [sedangMengirim, setSedangMengirim] = useState(false);
  const [pesanSukses, setPesanSukses] = useState<string | null>(null);
  const [pesanKesalahan, setPesanKesalahan] = useState<string | null>(null);

  const validateToken = () => {
    const tokenAkses = sessionStorage.getItem("access_token");
    const userId = sessionStorage.getItem("user_id");

    if (!tokenAkses)
      throw new Error("Token akses tidak ditemukan. Silakan login ulang.");
    if (!userId)
      throw new Error("ID pengguna tidak ditemukan. Silakan login ulang.");

    return { tokenAkses, userId };
  };

  const tambahkanAdmin = useCallback(
    async (formDataInput: {
      nama_depan: string;
      nama_belakang?: string;
      email: string;
      password: string;
      confirmPassword: string;
      peran: "Admin" | "Superadmin";
      id_stasiun?: string;
      foto?: File | null;
    }) => {
      setSedangMengirim(true);
      setPesanSukses(null);
      setPesanKesalahan(null);

      try {
        const { tokenAkses, userId } = validateToken();

        const formData = new FormData();
        formData.append("nama_depan", formDataInput.nama_depan);
        if (formDataInput.nama_belakang)
          formData.append("nama_belakang", formDataInput.nama_belakang);
        formData.append("email", formDataInput.email);
        formData.append("password", formDataInput.password);
        formData.append("confirmPassword", formDataInput.confirmPassword);
        formData.append("peran", formDataInput.peran);
        if (formDataInput.id_stasiun)
          formData.append("id_stasiun", formDataInput.id_stasiun);

        if (formDataInput.foto) {
          formData.append("foto", formDataInput.foto);
        } else {
          formData.append("foto", new Blob([]), "");
        }

        const response = await fetch(
          `https://buku-tamu-mkg-database.vercel.app/api/admin/create-admin`,
          {
            method: "POST",
            headers: {
              accept: "*/*",
              Authorization: `Bearer ${tokenAkses}`,
              user_id: userId,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}`;
          try {
            const errJson = await response.json();
            errorMessage = errJson.message || errJson.error || errorMessage;
          } catch {
            const errText = await response.text();
            errorMessage = errText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        const result: TambahAdminResponse = await response.json();
        setPesanSukses(result.message || "Admin berhasil ditambahkan!");
        return result;
      } catch (err: any) {
        console.error("❌ Error tambah admin:", err);
        setPesanKesalahan(
          err.message || "Terjadi kesalahan saat menambah admin."
        );
        throw err;
      } finally {
        setSedangMengirim(false);
      }
    },
    []
  );

  return {
    sedangMengirim,
    pesanSukses,
    pesanKesalahan,
    tambahkanAdmin,
  };
}
