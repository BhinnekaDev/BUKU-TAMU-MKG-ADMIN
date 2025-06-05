interface StatCardProps {
  title: string;
  value: string;
  color: string;
}

export default function StatCard({ title, value, color }: StatCardProps) {
  return (
    <div
      className="p-4 rounded-lg shadow w-full text-white"
      style={{ backgroundColor: color }}
    >
      <p className="text-sm mb-1">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
}
