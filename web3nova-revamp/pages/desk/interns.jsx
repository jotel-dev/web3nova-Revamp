import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, AlertCircle, User } from "lucide-react";
import DeskLayout from "@/components/Desk/DeskLayout";
import { deskFetch } from "@/lib/deskApi";

const API = process.env.NEXT_PUBLIC_API_URL || "";

export default function Interns() {
  const thisYear = new Date().getFullYear();
  const [year, setYear] = useState(thisYear);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // /applicants is admin-only and has email too — filter to admitted in-memory
      const data = await deskFetch(`/applicants?year=${year}`);
      setRows(data.filter((r) => r.is_active === 1));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <DeskLayout title="Interns">
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
        <span className="text-sm text-zinc-500 ml-auto">{rows.length} admitted</span>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2 mb-4">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {rows.length === 0 && !loading ? (
        <div className="text-zinc-500 text-sm py-10 text-center border border-zinc-900 rounded-xl">
          No admitted interns for {year}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                  <User size={22} className="text-zinc-500" />
                </div>
                <div>
                  <div className="font-medium">{r.full_name}</div>
                  <div className="text-xs font-mono text-zinc-500">{r.Matriculation_Number}</div>
                </div>
              </div>

              <div className="text-xs text-zinc-400 space-y-1">
                <div><span className="text-zinc-600">Dept:</span> {r.Department || "—"}</div>
                <div><span className="text-zinc-600">Email:</span> {r.email}</div>
                <div><span className="text-zinc-600">Cohort:</span> {r.cohort_year}</div>
                <div><span className="text-zinc-600">Joined:</span> {new Date(r.created_at).toLocaleDateString()}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </DeskLayout>
  );
}
