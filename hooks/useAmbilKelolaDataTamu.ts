import { useCallback, useEffect, useState } from "react";

export interface DataTamuProps {
  ID_Buku_Tamu: string;
  ID_Stasiun: string;
  Tujuan: string;
  Waktu_Kunjungan: string;
  Tanda_Tangan: string;
  Asal_Instansi: string;
  Asal_Pengunjung: string;
  Email_Pengunjung: string;
  Nama_Depan_Pengunjung: string;
  No_Telepon_Pengunjung: string;
  Nama_Belakang_Pengunjung: string;
  Nama_Stasiun: string;
}

interface ApiResponse {
  filter: {
    period?: string;
    startDate?: string;
    endDate?: string;
    filterStasiunId?: string;
  };
  isSuperadmin: boolean;
  count: number;
  data: DataTamuProps[];
}

interface FilterOptions {
  period?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  filterStasiunId?: string | null;
}

export function useAmbilDataTamu(filterOptions: FilterOptions = {}) {
  const [daftarTamu, setDaftarTamu] = useState<DataTamuProps[]>([]);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [pesanKesalahan, setPesanKesalahan] = useState<string | null>(null);
  const [isSuperadmin, setIsSuperadmin] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const validateToken = () => {
    const tokenAkses = sessionStorage.getItem("access_token");
    const idPengguna = sessionStorage.getItem("user_id");

    if (!tokenAkses) {
      throw new Error("Token akses tidak ditemukan. Silakan login ulang.");
    }

    if (!idPengguna) {
      throw new Error("ID pengguna tidak ditemukan. Silakan login ulang.");
    }

    // Check if token is expired (basic JWT check)
    try {
      const payload = JSON.parse(atob(tokenAkses.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        throw new Error("Token sudah kedaluwarsa. Silakan login ulang.");
      }
    } catch (e) {
      console.warn("Tidak dapat memvalidasi token JWT:", e);
    }

    return { tokenAkses, idPengguna };
  };

  const buildRequestParams = (): URLSearchParams => {
    const params = new URLSearchParams();

    // Prioritas: period > date range > default today
    if (filterOptions.period && filterOptions.period.trim() !== "") {
      params.append("period", filterOptions.period.trim());
    } else if (filterOptions.startDate || filterOptions.endDate) {
      // Jika ada startDate atau endDate, gunakan range
      const startDate =
        filterOptions.startDate?.trim() ||
        new Date().toISOString().split("T")[0];
      const endDate = filterOptions.endDate?.trim() || startDate;

      params.append("startDate", startDate);
      params.append("endDate", endDate);
    }
    // Jika tidak ada filter tanggal sama sekali, biarkan kosong (akan ambil semua data)

    // Filter stasiun (opsional)
    if (filterOptions.filterStasiunId?.trim()) {
      params.append("filterStasiunId", filterOptions.filterStasiunId.trim());
    }

    return params;
  };

  const ambilDataTamu = useCallback(async () => {
    setSedangMemuat(true);
    setPesanKesalahan(null);

    try {
      // Validasi token
      const { tokenAkses, idPengguna } = validateToken();

      // Build parameters
      const params = buildRequestParams();

      const url = `https://buku-tamu-mkg-database.vercel.app/api/admin/buku-tamu?${params.toString()}`;

      console.log("🚀 Mengirim request ke:", url);
      console.log("📋 Parameters:", Object.fromEntries(params));

      // Timeout untuk request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 detik timeout

      const respons = await fetch(url, {
        method: "GET",
        headers: {
          accept: "*/*",
          access_token: tokenAkses,
          user_id: idPengguna,
          "content-type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("📡 Status respons:", respons.status);

      // Handle different HTTP status codes
      if (respons.status === 401) {
        throw new Error(
          "Token tidak valid atau sudah kedaluwarsa. Silakan login ulang."
        );
      }

      if (respons.status === 403) {
        throw new Error("Anda tidak memiliki akses untuk melihat data ini.");
      }

      if (respons.status === 404) {
        throw new Error("Endpoint tidak ditemukan. Periksa URL API.");
      }

      if (!respons.ok) {
        let pesanError = `HTTP ${respons.status}: ${respons.statusText}`;

        try {
          const errorData = await respons.json();
          pesanError = errorData.message || errorData.error || pesanError;
          console.error("📋 Error details:", errorData);
        } catch {
          // Jika response bukan JSON, gunakan text
          const errorText = await respons.text();
          pesanError = errorText || pesanError;
          console.error("📋 Error text:", errorText);
        }

        throw new Error(`Gagal mengambil data: ${pesanError}`);
      }

      const json: ApiResponse = await respons.json();
      console.log("✅ RESPON API berhasil:", json);

      // Validate response structure
      if (!json || typeof json !== "object") {
        throw new Error("Format respons API tidak valid");
      }

      if (!Array.isArray(json.data)) {
        console.warn("⚠️ Data tidak dalam format array:", json);
        setDaftarTamu([]);
        setTotalCount(0);
        setIsSuperadmin(false);
        return;
      }

      // Update state with successful data
      setDaftarTamu(json.data);
      setTotalCount(json.count || json.data.length);
      setIsSuperadmin(json.isSuperadmin || false);

      console.log(`✅ Data berhasil dimuat: ${json.data.length} item`);
    } catch (err: unknown) {
      console.error("❌ Error dalam ambilDataTamu:", err);

      let pesanError = "Terjadi kesalahan yang tidak diketahui";

      if (err instanceof Error) {
        if (err.name === "AbortError") {
          pesanError = "Request timeout. Periksa koneksi internet Anda.";
        } else {
          pesanError = err.message;
        }
      }

      setPesanKesalahan(pesanError);

      // Reset data on error
      setDaftarTamu([]);
      setTotalCount(0);
      setIsSuperadmin(false);
    } finally {
      setSedangMemuat(false);
    }
  }, [
    filterOptions.period,
    filterOptions.startDate,
    filterOptions.endDate,
    filterOptions.filterStasiunId,
  ]);

  useEffect(() => {
    ambilDataTamu();
  }, [ambilDataTamu]);

  return {
    daftarTamu,
    sedangMemuat,
    pesanKesalahan,
    isSuperadmin,
    totalCount,
    refetchData: ambilDataTamu,
  };
}
