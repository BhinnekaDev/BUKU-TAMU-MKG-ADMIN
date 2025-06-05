"use client";

import { useRouter } from "next/navigation";
import { Plus, Users, FileText, Settings } from "lucide-react";

const actions = [
  {
    label: "Kelola Tamu",
    icon: <Users size={16} />,
    onClick: "/kelolabukutamu",
  },
  {
    label: "Laporan",
    icon: <FileText size={16} />,
    onClick: "/laporan",
  },
  {
    label: "Pengaturan",
    icon: <Settings size={16} />,
    onClick: "/pengaturan",
  },
];

export default function AksiCepat() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-6 w-full animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Aksi Cepat</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => router.push(action.onClick)}
            className="flex cursor-pointer items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 text-sm text-gray-800 font-medium transition-all shadow-sm border border-gray-200"
          >
            <span className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              {action.icon}
            </span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
