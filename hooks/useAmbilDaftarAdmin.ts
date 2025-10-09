import { useCallback, useEffect, useState } from "react";

export interface DataAdminProps {
  ID_Admin: string;
  Nama_Depan_Admin: string;
  Nama_Belakang_Admin: string | null;
  Email_Admin: string;
  Peran: "Admin" | "Superadmin";
  Foto_Admin: string | null;
  Created_At: string;
  Stasiun: {
    ID_Stasiun: string;
    Nama_Stasiun: string;
  } | null;
}

interface ApiResponse {
  message: string;
  count: number;
  data: DataAdminProps[];
}

export function useAmbilDaftarAdmin() {
  const [daftarAdmin, setDaftarAdmin] = useState<DataAdminProps[]>([]);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [pesanKesalahan, setPesanKesalahan] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  const validateToken = () => {
    const tokenAkses = sessionStorage.getItem("access_token");
    const userId = sessionStorage.getItem("user_id");

    if (!tokenAkses) {
      throw new Error("Token akses tidak ditemukan. Silakan login ulang.");
    }

    if (!userId) {
      throw new Error("ID pengguna tidak ditemukan. Silakan login ulang.");
    }

    try {
      const payload = JSON.parse(atob(tokenAkses.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        throw new Error("Token sudah kedaluwarsa. Silakan login ulang.");
      }
    } catch (e) {
      console.warn("Tidak dapat memvalidasi token JWT:", e);
    }

    return { tokenAkses, userId };
  };

  const ambilDaftarAdmin = useCallback(async () => {
    setSedangMemuat(true);
    setPesanKesalahan(null);

    try {
      const { tokenAkses, userId } = validateToken();

      const url = `https://buku-tamu-mkg-database.vercel.app/api/admin/all-admins`;

      console.log("Mengambil daftar admin dari:", url);

      // Timeout manual (30 detik)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const respons = await fetch(url, {
        method: "GET",
        headers: {
          accept: "*/*",
          access_token: tokenAkses,
          user_id: userId,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("📡 Status respons:", respons.status);

      if (respons.status === 401) {
        throw new Error(
          "Token tidak valid atau sudah kedaluwarsa. Silakan login ulang."
        );
      }

      if (respons.status === 403) {
        throw new Error("Anda tidak memiliki izin untuk melihat data admin.");
      }

      if (!respons.ok) {
        let pesanError = `HTTP ${respons.status}: ${respons.statusText}`;
        try {
          const errorData = await respons.json();
          pesanError = errorData.message || errorData.error || pesanError;
          console.error("Error details:", errorData);
        } catch {
          const errorText = await respons.text();
          pesanError = errorText || pesanError;
          console.error("Error text:", errorText);
        }
        throw new Error(pesanError);
      }

      const json: ApiResponse = await respons.json();
      console.log("RESPON API berhasil:", json);

      if (!json || typeof json !== "object" || !Array.isArray(json.data)) {
        throw new Error("Format respons API tidak valid.");
      }

      setDaftarAdmin(json.data);
      setTotalCount(json.count || json.data.length);
      console.log(`Total admin dimuat: ${json.data.length} item`);
    } catch (err: unknown) {
      console.error("Error dalam ambilDaftarAdmin:", err);

      let pesanError = "Terjadi kesalahan yang tidak diketahui.";
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          pesanError = "Request timeout. Periksa koneksi internet Anda.";
        } else {
          pesanError = err.message;
        }
      }

      setPesanKesalahan(pesanError);
      setDaftarAdmin([]);
      setTotalCount(0);
    } finally {
      setSedangMemuat(false);
    }
  }, []);

  // --- Panggil otomatis saat mount ---
  useEffect(() => {
    ambilDaftarAdmin();
  }, [ambilDaftarAdmin]);

  return {
    daftarAdmin,
    sedangMemuat,
    pesanKesalahan,
    totalCount,
    refetchAdmin: ambilDaftarAdmin,
  };
}
