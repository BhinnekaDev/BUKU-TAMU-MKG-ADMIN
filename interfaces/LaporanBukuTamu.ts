interface Guest {
  id: number;
  name: string;
  institution: string;
  jobTitle: string;
  purpose: string;
  visitDate: string;
  department: string;
  status: "Sedang Ditinjau" | "Diterima" | "Ditolak"; // Ubah disini
}
