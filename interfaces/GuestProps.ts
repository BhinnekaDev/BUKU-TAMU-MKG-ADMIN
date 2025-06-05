export interface Guest {
  id: number;
  name: string;
  institution: string;
  jobTitle: string;
  purpose: string;
  visitDate: string;
  status: "Sedang Ditinjau" | "Diterima" | "Ditolak";
  stationDestination: string; // tujuan stasiun baru
  signature: string; // base64 image tanda tangan
}
