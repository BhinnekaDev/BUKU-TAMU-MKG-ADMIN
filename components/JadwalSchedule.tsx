"use client";

interface ScheduleItem {
  time: string;
  activity: string;
  location: string;
  type?: "acara" | "rapat"; // tipe jadwal untuk badge
}

const schedule: ScheduleItem[] = [
  {
    time: "08:00",
    activity: "Briefing Pagi",
    location: "Ruang Rapat",
    type: "rapat",
  },
  {
    time: "10:00",
    activity: "Kunjungan Tamu",
    location: "Lobi Utama",
    type: "acara",
  },
  { time: "13:00", activity: "Maintenance Server", location: "Data Center" },
  {
    time: "15:00",
    activity: "Rapat Evaluasi",
    location: "Ruang Direktur",
    type: "rapat",
  },
];

// Icon kalender sederhana (outline)
function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-blue-600 flex-shrink-0 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export default function JadwalSchedule() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full h-[300px] overflow-auto">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Jadwal Hari Ini
      </h3>

      {/* Badges */}
      <div className="flex gap-3 mb-4">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
          Acara Yang Akan Datang
        </span>
        <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
          Rapat
        </span>
      </div>

      <ul className="space-y-4">
        {schedule.map((item, index) => (
          <li
            key={index}
            className={`border-l-4 pl-4 flex items-center space-x-2 ${
              item.type === "acara"
                ? "border-blue-600"
                : item.type === "rapat"
                ? "border-green-600"
                : "border-gray-300"
            }`}
          >
            <CalendarIcon />
            <div>
              <p className="text-sm font-medium text-gray-800">
                {item.time} - {item.activity}
              </p>
              <p className="text-xs text-gray-500">{item.location}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
