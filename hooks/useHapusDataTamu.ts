import { useState } from "react";

interface HapusDataTamuResponse {
  message: string;
  id_buku_tamu: string;
}

export function useHapusDataTamu() {
  const [sedangMenghapus, setSedangMenghapus] = useState(false);
  const [pesanKesalahan, setPesanKesalahan] = useState<string | null>(null);
  const [pesanBerhasil, setPesanBerhasil] = useState<string | null>(null);

  const hapusDataTamu = async (
    idBukuTamu: string,
  ): Promise<HapusDataTamuResponse | null> => {
    setSedangMenghapus(true);
    setPesanKesalahan(null);
    setPesanBerhasil(null);

    try {
      const tokenAkses = sessionStorage.getItem("access_token");
      const idPengguna = sessionStorage.getItem("user_id");

      if (!tokenAkses) {
        throw new Error("Token akses tidak ditemukan. Silakan login ulang.");
      }

      if (!idPengguna) {
        throw new Error("ID pengguna tidak ditemukan. Silakan login ulang.");
      }

      const response = await fetch(
        `https://buku-tamu-mkg-database.vercel.app/api/admin/buku-tamu/${idBukuTamu}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tokenAkses}`,
            user_id: idPengguna,
            Accept: "application/json",
          },
        },
      );

      let responseData: any = null;

      try {
        responseData = await response.json();
      } catch {
        // ignore
      }

      if (!response.ok) {
        switch (response.status) {
          case 400:
            throw new Error(
              responseData?.message || "Data admin tidak ditemukan.",
            );

          case 401:
            throw new Error(
              "Sesi login telah berakhir. Silakan login kembali.",
            );

          case 403:
            throw new Error(
              "Anda tidak memiliki izin untuk menghapus data buku tamu ini.",
            );

          case 404:
            throw new Error(
              responseData?.message || "Data buku tamu tidak ditemukan.",
            );

          default:
            throw new Error(
              responseData?.message ||
                `Terjadi kesalahan (${response.status}).`,
            );
        }
      }

      setPesanBerhasil(
        responseData?.message ?? "Data buku tamu berhasil dihapus.",
      );

      return responseData;
    } catch (err) {
      let message = "Terjadi kesalahan yang tidak diketahui.";

      if (err instanceof Error) {
        message = err.message;

        // Sembunyikan detail stasiun dari backend
        if (message.includes("tidak dapat menghapus data dari stasiun")) {
          message =
            "Anda tidak memiliki izin untuk menghapus data buku tamu ini.";
        }
      }

      setPesanKesalahan(message);
      throw new Error(message);
    } finally {
      setSedangMenghapus(false);
    }
  };

  return {
    hapusDataTamu,
    sedangMenghapus,
    pesanKesalahan,
    pesanBerhasil,
  };
}
