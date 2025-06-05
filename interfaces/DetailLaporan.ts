export interface DetailLaporanProps {
  report: {
    date: string;
    name: string;
    institution: string;
    jobTitle: string;
    purpose: string;
    checkIn: string;
  };
  onClose: () => void;
}
