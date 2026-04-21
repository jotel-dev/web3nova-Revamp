import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, AlertCircle, Clock, CalendarDays } from "lucide-react";
import DeskLayout from "@/components/Desk/DeskLayout";
import { deskFetch } from "@/lib/deskApi";

export default function AttendanceSummary() {
  const thisYear = new Date().getFullYear();
  const [year, setYear] = useState(thisYear);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await deskFetch(`/attendance/summary?year=${year}`);
      setRows(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    load();
  }, [load]);

  const totals = rows.reduce(
    (acc, r) => {
      acc.hours += r.total_hours || 0;
      acc.days += r.days_present || 0;
      return acc;
    },
    { hours: 0, days: 0 }
  );

  return (
    <DeskLayout title="Attendance">
      <div className="flex items-center gap-3 mb-5">
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm w-28"
        />
        <button
          onClick={load}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2 mb-4">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
          <div className="text-xs text-zinc-500 mb-1">Interns</div>
          <div className="text-2xl font-semibold">{rows.length}</div>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
          <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><CalendarDays size={12} /> Total days</div>
          <div className="text-2xl font-semibold">{totals.days}</div>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
          <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><Clock size={12} /> Total hours</div>
          <div className="text-2xl font-semibold">{totals.hours.toFixed(1)}</div>
        </div>
      </div>

      <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-400">
            <tr>
              <th className="text-left px-4 py-3">Matric</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Department</th>
              <th className="text-right px-4 py-3">Days</th>
              <th className="text-right px-4 py-3">Hours</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-500">
                  No attendance records for {year}.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <motion.tr
                key={r.Matriculation_Number}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-t border-zinc-900 hover:bg-zinc-900/40"
              >
                <td className="px-4 py-3 font-mono text-xs">{r.Matriculation_Number}</td>
                <td className="px-4 py-3">{r.full_name}</td>
                <td className="px-4 py-3 text-zinc-400">{r.Department || "—"}</td>
                <td className="px-4 py-3 text-right">{r.days_present}</td>
                <td className="px-4 py-3 text-right font-medium">{Number(r.total_hours).toFixed(1)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </DeskLayout>
  );
}
