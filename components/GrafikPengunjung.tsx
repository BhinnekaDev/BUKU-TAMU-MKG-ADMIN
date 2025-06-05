"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface GrafikPengunjungProps {
  filter: "today" | "week" | "month";
}

const sampleData = {
  today: [
    { hour: "08:00", visitors: 5 },
    { hour: "09:00", visitors: 7 },
    { hour: "10:00", visitors: 10 },
    { hour: "11:00", visitors: 8 },
    { hour: "12:00", visitors: 6 },
    { hour: "13:00", visitors: 9 },
    { hour: "14:00", visitors: 4 },
    { hour: "15:00", visitors: 3 },
  ],
  week: [
    { hour: "Sen", visitors: 14 },
    { hour: "Sel", visitors: 22 },
    { hour: "Rab", visitors: 18 },
    { hour: "Kam", visitors: 25 },
    { hour: "Jum", visitors: 30 },
    { hour: "Sab", visitors: 20 },
    { hour: "Min", visitors: 15 },
  ],
  month: [
    { hour: "1", visitors: 10 },
    { hour: "5", visitors: 22 },
    { hour: "10", visitors: 15 },
    { hour: "15", visitors: 18 },
    { hour: "20", visitors: 24 },
    { hour: "25", visitors: 20 },
    { hour: "30", visitors: 28 },
  ],
};

export default function GrafikPengunjung({ filter }: GrafikPengunjungProps) {
  const chartData = sampleData[filter];

  const labelKey = filter === "today" ? "hour" : "hour"; // could be changed to "day" for week/month

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full h-[300px]">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Grafik Pengunjung{" "}
        {filter === "today"
          ? "(Hari Ini per Jam)"
          : filter === "week"
          ? "(Minggu Ini per Hari)"
          : "(Bulan Ini per Tanggal)"}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 20, bottom: 0, left: -10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={labelKey} stroke="#888" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="visitors"
            stroke="#1A6EB5"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
