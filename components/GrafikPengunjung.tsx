"use client";

import {
  Area,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface GrafikPengunjungProps {
  filter: "today" | "week" | "month";
  data: { hour: string; visitors: number }[];
}

export default function GrafikPengunjung({
  filter,
  data,
}: GrafikPengunjungProps) {
  const labelKey = "hour";

  const getFilterLabel = () => {
    switch (filter) {
      case "today":
        return "(Hari Ini)";
      case "week":
        return "(Minggu Ini)";
      case "month":
        return "(Bulan Ini)";
    }
  };

  // Data dummy agar grid dan sumbu tetap muncul
  const dummyData = [{ hour: "", visitors: 0 }];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full h-[300px] flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 self-start">
        Grafik Pengunjung {getFilterLabel()}
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data.length > 0 ? data : dummyData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1A6EB5" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#1A6EB5" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={labelKey} stroke="#888" />
          <YAxis />

          <Tooltip
            formatter={(value: number) => [`${value} pengunjung`, "Jumlah"]}
          />

          <Area
            type="monotone"
            dataKey="visitors"
            stroke="none"
            fill="url(#colorLine)"
            fillOpacity={0.3}
          />

          <Line
            type="monotone"
            dataKey="visitors"
            stroke="#1A6EB5"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />

          {data.length === 0 && (
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#999"
              fontSize={14}
            >
              Tidak ada data pengunjung
            </text>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
