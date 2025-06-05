interface GuestReport {
  id: number;
  name: string;
  institution: string;
  jobTitle: string;
  purpose: string;
  visitDateTime: string;
}

interface AksiCepatLaporanProps {
  selectedReport?: GuestReport | null;
}
