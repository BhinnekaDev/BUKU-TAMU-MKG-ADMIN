import Pengaturan from "@/components/Pengaturan";
import Sidebar from "@/components/Sidebar";
import HeaderDashboard from "@/components/HeaderDashboard";
import Footer from "@/components/Footer";

export default function PengaturanPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      {/* Kontainer utama yang bisa di-scroll */}
      <div className="flex-1 flex flex-col bg-[#f6f9fc] overflow-y-auto max-h-screen">
        <HeaderDashboard title="Pengaturan" />

        <div className="p-6">
          <Pengaturan />
        </div>
      </div>
    </div>
  );
}
