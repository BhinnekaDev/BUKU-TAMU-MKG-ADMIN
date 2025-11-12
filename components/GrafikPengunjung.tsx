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

  // Judul di atas grafik
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

  const getXAxisLabel = () => {
    switch (filter) {
      case "today":
        return "Jam";
      case "week":
        return "Hari";
      case "month":
        return "Tanggal";
      default:
        return "";
    }
  };

  const roundedData = data.map((d) => ({
    ...d,
    visitors: Math.round(d.visitors),
  }));

  const dummyData = [{ hour: "", visitors: 0 }];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full h-[340px] flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold text-gray-700 mb-2 self-start">
        Grafik Pengunjung {getFilterLabel()}
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={roundedData.length > 0 ? roundedData : dummyData}
          margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
        >
          <defs>
            <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1A6EB5" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#1A6EB5" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={labelKey}
            stroke="#888"
            tickFormatter={(value) => {
              if (filter === "month") return `Tgl ${value}`;
              if (filter === "week") return `Hari ${value}`;
              return value;
            }}
          />
          <YAxis allowDecimals={false} />
          <Tooltip
            formatter={(value: number) => [
              `${Math.round(value)} pengunjung`,
              "Jumlah",
            ]}
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

          {/* Pesan jika tidak ada data */}
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

          {/* label penjelas di bawah grafik */}
          <text
            x="50%"
            y="95%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#555"
            fontSize={12}
          >
            {getXAxisLabel()}
          </text>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
