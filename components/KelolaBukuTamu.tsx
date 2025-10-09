"use client";

import Pagination from "@/components/PaginationKelolaDataTamu";
import { useAmbilDataTamu } from "@/hooks/useAmbilKelolaDataTamu";
import { Buffer } from "buffer";
import { format, parse } from "date-fns";
import { id } from "date-fns/locale";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function KelolaBukuTamu() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTujuan] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterLaporan, setFilterLaporan] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selectedStasiun, setSelectedStasiun] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);

  interface StasiunOption {
    id: string;
    nama: string;
  }

  // Move stasiunListDefault outside of component or memoize it to prevent re-creation
  const stasiunListDefault: StasiunOption[] = useMemo(
    () => [
      {
        id: "5b2df30a-4204-470a-bfff-da645ed475d4",
        nama: "Stasiun Klimatologi",
      },
      { id: "d0daab05-49d2-4772-ba18-9788df033f97", nama: "Stasiun Geofisika" },
      {
        id: "f72d6a9f-4c33-4de6-a6b1-4318ac658f70",
        nama: "Stasiun Meteorologi",
      },
    ],
    []
  );

  const [isDropdownLocked, setIsDropdownLocked] = useState<boolean>(true);
  const [stasiunList, setStasiunList] = useState<StasiunOption[]>([]);

  // Hook dengan filter yang sudah diperbaiki
  const { daftarTamu, sedangMemuat, pesanKesalahan, isSuperadmin } =
    useAmbilDataTamu({
      filterStasiunId: selectedStasiun || null,
      period: filterLaporan,
      startDate: startDate,
      endDate: endDate,
    });

  const itemsPerPage = 5;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize user role and station list - Fixed dependency array
  useEffect(() => {
    const idStasiunSession = sessionStorage.getItem("id_stasiun") || "";

    if (isSuperadmin) {
      // Superadmin bisa melihat semua stasiun
      setIsDropdownLocked(false);
      setStasiunList(stasiunListDefault);
      // Tetapkan default jika belum ada stasiun terpilih
      setSelectedStasiun((prev) => prev || "");
    } else {
      // Role biasa hanya melihat stasiunnya sendiri
      setIsDropdownLocked(true);
      setSelectedStasiun(idStasiunSession);

      const stasiunPengguna = stasiunListDefault.find(
        (s) => s.id === idStasiunSession
      );
      if (stasiunPengguna) {
        setStasiunList([stasiunPengguna]);
      } else {
        // fallback jika session tidak sesuai
        setStasiunList([]);
      }
    }
  }, [isSuperadmin, stasiunListDefault]);

  const tampilkanData = useCallback(
    (nilai: string | null | undefined) => (nilai?.trim() ? nilai : "-"),
    []
  );

  // Ubah timezone secara aman (ISO format tetap disarankan)
  const parseCustomTanggal = useCallback((tanggal: string) => {
    try {
      if (!tanggal || typeof tanggal !== "string") return null;

      // Format yang digunakan: Selasa, 15 Juli 2025, 19.08
      const parsed = parse(tanggal, "EEEE, dd MMMM yyyy, HH.mm", new Date(), {
        locale: id,
      });

      if (isNaN(parsed.getTime())) {
        console.warn("Gagal parse format lokal:", tanggal);
        return null;
      }

      return parsed;
    } catch (err) {
      console.error("Error parse tanggal lokal:", err);
      return null;
    }
  }, []);

  const convertToJakartaTime = useCallback(
    (isoString: string) => {
      try {
        if (!isoString || typeof isoString !== "string") {
          return null;
        }

        let parsedDate: Date;

        // Coba parse format lokal dulu
        parsedDate = parseCustomTanggal(isoString) as Date;

        // Kalau gagal, coba format ISO biasa
        if (!parsedDate || isNaN(parsedDate.getTime())) {
          let cleanedString = isoString.trim();

          if (
            !cleanedString.includes("T") &&
            !cleanedString.includes("Z") &&
            !cleanedString.includes("+")
          ) {
            cleanedString = cleanedString + "T00:00:00.000Z";
          }

          parsedDate = new Date(cleanedString);
        }

        if (isNaN(parsedDate.getTime())) {
          console.warn("Tanggal tetap tidak bisa diparse:", isoString);
          return null;
        }

        // Konversi ke WIB
        const utc =
          parsedDate.getTime() + parsedDate.getTimezoneOffset() * 60000;
        const jakartaOffset = 7 * 60 * 60000;
        return new Date(utc + jakartaOffset);
      } catch (error) {
        console.error("Error konversi waktu:", error);
        return null;
      }
    },
    [parseCustomTanggal]
  );

  const formatTanggal = useCallback(
    (tanggal: string | null | undefined) => {
      try {
        if (!tanggal || typeof tanggal !== "string") {
          return "-";
        }

        const jakartaDate = convertToJakartaTime(tanggal);
        if (!jakartaDate || isNaN(jakartaDate.getTime())) {
          return "-";
        }

        return format(jakartaDate, "dd MMMM yyyy, HH:mm", { locale: id });
      } catch (error) {
        console.error("Gagal format tanggal:", error);
        return "-";
      }
    },
    [convertToJakartaTime]
  );

  // Fixed filtering logic - hanya untuk client-side filtering
  const filteredData = useMemo(() => {
    if (sedangMemuat || !daftarTamu) return [];
    let hasil = [...daftarTamu];

    // Apply search filter (client-side)
    if (searchTerm.trim()) {
      const keyword = searchTerm.toLowerCase();
      hasil = hasil.filter((tamu) => {
        const nama = `${tampilkanData(
          tamu?.Nama_Depan_Pengunjung
        )} ${tampilkanData(tamu?.Nama_Belakang_Pengunjung)}`.toLowerCase();

        const tujuan = tampilkanData(tamu?.Tujuan).toLowerCase();
        const stasiun = tampilkanData(tamu?.Nama_Stasiun).toLowerCase();
        const email = tampilkanData(tamu?.Email_Pengunjung).toLowerCase();
        const noTelp = tampilkanData(tamu?.No_Telepon_Pengunjung).toLowerCase();

        return (
          nama.includes(keyword) ||
          tujuan.includes(keyword) ||
          stasiun.includes(keyword) ||
          email.includes(keyword) ||
          noTelp.includes(keyword)
        );
      });
    }

    // Apply purpose filter (client-side)
    if (filterTujuan) {
      hasil = hasil.filter((tamu) => tamu?.Tujuan === filterTujuan);
    }

    return hasil;
  }, [daftarTamu, sedangMemuat, searchTerm, filterTujuan, tampilkanData]);

  // Fixed pagination logic with proper dependencies
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  const currentItems = useMemo(() => {
    return filteredData.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredData, indexOfFirstItem, indexOfLastItem]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    filterTujuan,
    selectedStasiun,
    filterLaporan,
    startDate,
    endDate,
  ]);

  // Get unique purposes for filter dropdown - Removed unused variable warning
  // const uniquePurposes = useMemo(() => {
  //   if (!daftarTamu) return [];
  //   const purposes = daftarTamu
  //     .map((tamu) => tamu?.Tujuan)
  //     .filter(
  //       (purpose, index, arr) =>
  //         purpose && purpose.trim() && arr.indexOf(purpose) === index
  //     );
  //   return purposes.sort();
  // }, [daftarTamu]);

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Daftar Tamu");

    // Define columns
    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Nama", key: "nama", width: 25 },
      { header: "No Telepon", key: "noTelepon", width: 18 },
      { header: "Email", key: "email", width: 28 },
      { header: "Keperluan", key: "keperluan", width: 25 },
      { header: "Asal", key: "asal", width: 20 },
      { header: "Tujuan", key: "tujuan", width: 20 },
      { header: "Tanggal", key: "tanggal", width: 22 },
      { header: "Tanda Tangan", key: "tandaTangan", width: 18 },
    ];

    // Add data rows
    filteredData.forEach((tamu, index) => {
      worksheet.addRow({
        no: index + 1,
        nama: `${tampilkanData(tamu?.Nama_Depan_Pengunjung)} ${tampilkanData(
          tamu?.Nama_Belakang_Pengunjung
        )}`,
        noTelepon: tampilkanData(tamu?.No_Telepon_Pengunjung),
        email: tampilkanData(tamu?.Email_Pengunjung),
        keperluan: tampilkanData(tamu?.Tujuan),
        asal: tampilkanData(tamu?.Asal_Pengunjung),
        tujuan: tampilkanData(tamu?.Nama_Stasiun),
        tanggal: formatTanggal(tamu?.Waktu_Kunjungan),
        tandaTangan: "", // Placeholder for signature image
      });
    });

    // Format header
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4F81BD" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Format content rows
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return;
      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });
    });

    // Add signature images
    for (let index = 0; index < filteredData.length; index++) {
      const tamu = filteredData[index];
      if (tamu?.Tanda_Tangan) {
        try {
          const response = await fetch(tamu?.Tanda_Tangan);
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString("base64");

          const imageId = workbook.addImage({
            base64: base64,
            extension: "png",
          });

          const rowNumber = index + 2; // Header is in row 1
          worksheet.addImage(imageId, {
            tl: { col: 8, row: rowNumber - 1 }, // Column 9 (Signature)
            ext: { width: 80, height: 40 },
          });

          worksheet.getRow(rowNumber).height = 40;
        } catch (error) {
          console.error(
            `Failed to load signature for row ${index + 1}:`,
            error
          );
        }
      }
    }

    // Save Excel file
    const fileBuffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([fileBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `Daftar_Tamu?.xlsx`
    );
  };

  const handleExportPDF = async () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = "/LogoBmkgSmall.png";

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const logoBase64 = canvas.toDataURL("image/png");

      // Header
      // === KOP SURAT BMKG ===
      doc.addImage(logoBase64, "PNG", 25, 10, 30, 25);

      // Nama Instansi
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("BADAN METEOROLOGI, KLIMATOLOGI, DAN GEOFISIKA", 148.5, 15, {
        align: "center",
      });

      doc.setFontSize(13);
      doc.text("PROVINSI BENGKULU", 148.5, 21, { align: "center" });

      // Alamat & Kontak
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const alamat = [
        "Stasiun Meteorologi Fatmawati Soekarno - Jl. Raya Padang Kemiling KM 14,5 Bengkulu 38211 | Telp: (0736) 52008",
        "Stasiun Klimatologi Pulau Baai - Jl. Ir. Rustandi Sugianto, Pulau Baai Bengkulu | Telp: (0736) 51251/53030 | Fax: (0736) 51426",
        "Stasiun Geofisika Kepahiang - Jl. Merdeka No. 59, Kepahiang Bengkulu 39372 | Telp: (0732) 21084",
        "Stasiun Geofisika Sawah Lebar - Jl. Raya Bentiring, Sawah Lebar, Bengkulu | Telp: (0736) 54059",
      ];

      // Posisi awal alamat
      const alamatStartY = 28;
      doc.text(alamat, 148.5, alamatStartY, { align: "center", maxWidth: 250 });

      // Hitung posisi akhir alamat
      const lineHeight = 4; // tinggi antar baris untuk font size 8
      const alamatEndY = alamatStartY + alamat.length * lineHeight;

      // Garis pemisah kop surat
      const garisY = alamatEndY + 2;
      doc.setLineWidth(0.5);
      doc.line(15, garisY, 282, garisY);

      // === JUDUL LAPORAN ===
      const judulY = garisY + 8;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Laporan Data Tamu", 148.5, judulY, { align: "center" });

      // Tanggal & Periode
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      const currentDate = new Date().toLocaleDateString("id-ID");

      if (startDate && endDate) {
        const formattedStart = formatTanggal(startDate);
        const formattedEnd = formatTanggal(endDate);
        doc.text(
          `Periode: ${formattedStart} hingga ${formattedEnd}`,
          148.5,
          judulY + 5,
          { align: "center" }
        );
      }

      doc.text(`Dicetak pada: ${currentDate}`, 148.5, judulY + 11, {
        align: "center",
      });

      // === POSISI TABEL ===
      const startY = judulY + 15;

      const tandaTanganImages: (string | null)[] = [];

      // Tabel body
      const tableBody = await Promise.all(
        filteredData.map(async (tamu, index) => {
          let tandaTanganBase64: string | null = null;

          if (tamu?.Tanda_Tangan) {
            try {
              const response = await fetch(tamu?.Tanda_Tangan, {
                mode: "cors",
              });
              const blob = await response.blob();
              const reader = new FileReader();

              tandaTanganBase64 = await new Promise<string>(
                (resolve, reject) => {
                  reader.onloadend = () => {
                    if (typeof reader.result === "string") {
                      resolve(reader.result);
                    } else {
                      reject("Failed to read signature.");
                    }
                  };
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                }
              );
            } catch (err) {
              console.error(`❌ Failed to load signature [${index}]`, err);
            }
          }

          tandaTanganImages.push(tandaTanganBase64);

          return [
            index + 1,
            `${tampilkanData(tamu?.Nama_Depan_Pengunjung)} ${tampilkanData(
              tamu?.Nama_Belakang_Pengunjung
            )}`,
            tampilkanData(tamu?.No_Telepon_Pengunjung),
            tampilkanData(tamu?.Email_Pengunjung),
            tampilkanData(tamu?.Tujuan),
            tampilkanData(tamu?.Asal_Pengunjung),
            tampilkanData(tamu?.Nama_Stasiun),
            formatTanggal(tamu?.Waktu_Kunjungan),
            "", // <== Tidak pakai __img${index}, cukup kosong
          ];
        })
      );

      // Generate Table
      autoTable(doc, {
        startY,
        head: [
          [
            "No",
            "Nama",
            "Nomor Telepon",
            "Email",
            "Keperluan",
            "Asal",
            "Tujuan",
            "Tanggal",
            "Tanda Tangan",
          ],
        ],
        body: tableBody,
        margin: { left: 35, right: 25 },
        styles: {
          fontSize: 8,
          cellPadding: 2,
          valign: "middle",
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: "bold",
          fontSize: 9,
        },
        bodyStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: 12 },
          1: { cellWidth: 30 },
          2: { cellWidth: 25 },
          3: { cellWidth: 35 },
          4: { cellWidth: 35, halign: "left", valign: "top", cellPadding: 2 },
          5: { cellWidth: 25 },
          6: { cellWidth: 25 },
          7: { cellWidth: 25 },
          8: { cellWidth: 30 },
        },
        didDrawCell: (data) => {
          // Hanya gambar tanda tangan di bagian body tabel
          if (data.section === "body" && data.column.index === 8) {
            const imgBase64 = tandaTanganImages[data.row.index];
            if (imgBase64) {
              doc.addImage(
                imgBase64,
                "PNG",
                data.cell.x + 2,
                data.cell.y + 2,
                26,
                12
              );
            }
          }
        },
      });

      doc.save("Laporan Data Tamu BMKG Provinsi Bengkulu.pdf");
    };

    img.onerror = () => {
      console.error("Failed to load header image.");
    };
  };

  if (sedangMemuat) {
    return (
      <div className="p-6 bg-white rounded-xl shadow">
        <div className="flex justify-center items-center h-64 text-gray-500">
          Memuat data...
        </div>
      </div>
    );
  }

  if (pesanKesalahan) {
    return (
      <div className="p-6 bg-white rounded-xl shadow">
        <div className="flex justify-center items-center h-64 text-red-500">
          Error: {pesanKesalahan}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <div className="w-full sm:w-auto">
          {/* Replace with your SearchTamu component */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari tamu?..."
            className="w-[300px] h-10 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={selectedStasiun}
            onChange={(e) => setSelectedStasiun(e.target.value)}
            disabled={isDropdownLocked}
            className={`h-10 text-sm px-3 py-1.5 border rounded-md shadow-sm min-w-[140px] focus:outline-none 
    ${
      isDropdownLocked
        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
        : "border-gray-300 text-black-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
    }`}
          >
            {!isDropdownLocked && <option value="">Semua Stasiun</option>}

            {isDropdownLocked ? (
              <option value={selectedStasiun}>
                {stasiunList.find((s) => s.id === selectedStasiun)?.nama ||
                  "Stasiun Default"}
              </option>
            ) : (
              stasiunList.map((stasiun) => (
                <option key={stasiun.id} value={stasiun.id}>
                  {stasiun.nama}
                </option>
              ))
            )}
          </select>

          <select
            value={filterLaporan || ""}
            onChange={(e) => {
              const value = e.target.value || null;
              setFilterLaporan(value);
              // Clear date filters when period is selected
              if (value) {
                setStartDate(null);
                setEndDate(null);
              }
            }}
            className="h-10 text-sm px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[140px]"
          >
            <option value="">Semua Periode</option>
            <option value="hari">Hari Ini</option>
            <option value="minggu">Minggu Ini</option>
            <option value="bulan">Bulan Ini</option>
          </select>
          {/* Date Filter Dropdown */}
          <div className="relative group">
            <div className="relative inline-block text-left" ref={dropdownRef}>
              {/* Tombol buka dropdown */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white border border-gray-300 px-4 py-2 rounded-md shadow-sm text-sm  text-black-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                Pilih Tanggal
              </button>

              {/* Dropdown */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-[200px] bg-white border border-gray-200 cursor-pointer rounded-md shadow-lg z-20 p-3 animate-fade-in">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-gray-600">Dari</label>
                    <input
                      type="date"
                      value={startDate || ""}
                      onChange={(e) => {
                        const val = e.target.value || null;
                        setStartDate(val);
                        if (val) setFilterLaporan(null);
                      }}
                      className="h-9 text-sm px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-full"
                    />

                    <label className="text-xs text-gray-600 mt-2">Sampai</label>
                    <input
                      type="date"
                      value={endDate || ""}
                      onChange={(e) => {
                        const val = e.target.value || null;
                        setEndDate(val);
                        if (val) setFilterLaporan(null);
                      }}
                      className="h-9 text-sm px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Export Dropdown */}
          <div className="relative group">
            <button className="h-10 text-sm px-3 py-1.5 border border-blue-600 text-blue-600 cursor-pointer rounded-md bg-white flex items-center gap-2">
              <Download size={16} /> Export
            </button>

            <div className="absolute hidden group-hover:block cursor-pointer bg-white border border-gray-200 shadow-lg mt-1 rounded-md z-10 min-w-[110px]">
              <button
                onClick={handleExportExcel}
                className="block w-full text-left px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                Export Excel
              </button>
              <button
                onClick={handleExportPDF}
                className="block w-full text-left px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">No</th>
            <th className="p-2">Nama</th>
            <th className="p-2">No Telepon</th>
            <th className="p-2">Email</th>
            <th className="p-2">Keperluan</th>
            <th className="p-2">Asal</th>
            <th className="p-2">Tujuan</th>
            <th className="p-2">Waktu Kunjungan</th>
            <th className="p-2">Tanda Tangan</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((tamu, index) => (
              <tr key={tamu?.ID_Buku_Tamu} className="border-b">
                <td className="p-2">{indexOfFirstItem + index + 1}</td>
                <td className="p-2">
                  {tampilkanData(tamu?.Nama_Depan_Pengunjung)}{" "}
                  {tampilkanData(tamu?.Nama_Belakang_Pengunjung)}
                </td>
                <td className="p-2">
                  {tampilkanData(tamu?.No_Telepon_Pengunjung)}
                </td>
                <td className="p-2">{tampilkanData(tamu?.Email_Pengunjung)}</td>
                <td className="p-2 max-w-[150px] whitespace-normal break-words sm:max-w-[200px] md:max-w-[250px]">
                  {tampilkanData(tamu?.Tujuan)}
                </td>
                <td className="p-2">{tampilkanData(tamu?.Asal_Pengunjung)}</td>
                <td className="p-2">{tampilkanData(tamu?.Nama_Stasiun)}</td>
                <td className="p-2">{formatTanggal(tamu?.Waktu_Kunjungan)}</td>
                <td className="p-2">
                  {tamu?.Tanda_Tangan ? (
                    <Image
                      src={tamu?.Tanda_Tangan}
                      alt="Tanda Tangan"
                      width={100}
                      height={40}
                      className="object-contain"
                    />
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="p-8 text-center text-gray-500">
                Tidak ada data tamu ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
