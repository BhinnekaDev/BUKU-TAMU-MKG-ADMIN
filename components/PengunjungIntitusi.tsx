"use client";

import { useEffect, useState } from "react";
import { Building2, Landmark, FileText } from "lucide-react"; // Lucide lebih clean

interface VisitorInstitution {
  name: string;
  type: "Dinas" | "Kantor" | "Universitas";
  visits: number;
}

const visitorInstitutions: VisitorInstitution[] = [
  { name: "Dinas Pendidikan", type: "Dinas", visits: 120 },
  { name: "Kantor Kecamatan", type: "Kantor", visits: 95 },
  { name: "Universitas Padjadjaran", type: "Universitas", visits: 150 },
  { name: "Dinas Kesehatan", type: "Dinas", visits: 80 },
  { name: "Kantor Pos", type: "Kantor", visits: 60 },
  { name: "Universitas Islam Bandung", type: "Universitas", visits: 110 },
];

function getIcon(type: VisitorInstitution["type"]) {
  switch (type) {
    case "Universitas":
      return <Landmark className="text-blue-500" size={18} />;
    case "Kantor":
      return <Building2 className="text-green-500" size={18} />;
    case "Dinas":
      return <FileText className="text-purple-500" size={18} />;
    default:
      return null;
  }
}

export default function PengunjungInstitusi() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const maxVisit = Math.max(...visitorInstitutions.map((v) => v.visits));

  return (
    <div
      className={`bg-white rounded-2xl shadow-md p-6 mt-6 w-full transition-all duration-700 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Pengunjung dari Institusi
      </h3>
      <div className="space-y-4">
        {visitorInstitutions.map((visitor, idx) => {
          const barWidth = (visitor.visits / maxVisit) * 100;
          return (
            <div
              key={idx}
              className="group transition hover:bg-blue-50 rounded-lg px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getIcon(visitor.type)}
                  <div>
                    <div className="font-medium text-gray-800">
                      {visitor.name}
                    </div>
                    <div className="text-xs text-gray-500">{visitor.type}</div>
                  </div>
                </div>
                <div className="font-semibold text-blue-700">
                  {visitor.visits}
                </div>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-300 transition-all duration-500"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
