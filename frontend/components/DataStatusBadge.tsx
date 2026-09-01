export default function DataStatusBadge({
  status,
}: {
  status: "real" | "synthetic";
}) {
  const isReal = status === "real";

  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${
        isReal
          ? "border-emerald-400/20 bg-emerald-400/5"
          : "border-amber-400/20 bg-amber-400/5"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isReal ? "bg-emerald-400" : "bg-amber-400"
        }`}
      />
      <span
        className={`text-[10px] font-semibold ${
          isReal ? "text-emerald-300" : "text-amber-300"
        }`}
      >
        {isReal ? "REAL DATA" : "SYNTHETIC DATA"}
      </span>
    </div>
  );
}