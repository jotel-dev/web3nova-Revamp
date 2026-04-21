import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Loader2, RefreshCw, AlertCircle, Eye } from "lucide-react";
import DeskLayout from "@/components/Desk/DeskLayout";
import ApplicantModal from "@/components/Desk/ApplicantModal";
import { deskFetch } from "@/lib/deskApi";

export default function Applicants() {
  const thisYear = new Date().getFullYear();
  const [year, setYear] = useState(thisYear);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [viewMatric, setViewMatric] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await deskFetch(`/applicants?year=${year}`);
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

  async function decide(matric, admit) {
    setBusyId(matric);
    try {
      await deskFetch(`/admit`, {
        method: "PATCH",
        body: JSON.stringify({ Matriculation_Number: matric, admit }),
      });
      setRows((rs) =>
        rs.map((r) =>
          r.Matriculation_Number === matric
            ? { ...r, is_active: admit ? 1 : 0, status: admit ? "admitted" : "rejected" }
            : r
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <DeskLayout title="Applicants">
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
        <span className="text-sm text-zinc-500 ml-auto">{rows.length} applicants</span>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2 mb-4">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-400">
            <tr>
              <th className="text-left px-4 py-3 w-12"></th>
              <th className="text-left px-4 py-3">Matric</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Department</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-zinc-500">
                  No applicants for {year}.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <motion.tr
                key={r.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-t border-zinc-900 hover:bg-zinc-900/40"
              >
                <td className="px-4 py-2">
                  <div className="w-9 h-9 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center">
                    {r.photo_url ? (
                      <img src={r.photo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-zinc-500">N/A</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{r.Matriculation_Number}</td>
                <td className="px-4 py-3">{r.full_name}</td>
                <td className="px-4 py-3 text-zinc-400">{r.email}</td>
                <td className="px-4 py-3 text-zinc-400">{r.Department || "—"}</td>
                <td className="px-4 py-3">
                  {r.status === "admitted" ? (
                    <span className="text-green-400 text-xs bg-green-950/40 px-2 py-1 rounded">
                      admitted
                    </span>
                  ) : r.status === "rejected" ? (
                    <span className="text-red-400 text-xs bg-red-950/40 px-2 py-1 rounded">
                      rejected
                    </span>
                  ) : (
                    <span className="text-amber-400 text-xs bg-amber-950/40 px-2 py-1 rounded">
                      pending
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => setViewMatric(r.Matriculation_Number)}
                      className="inline-flex items-center gap-1 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-3 py-1 rounded text-xs"
                      title="View details"
                    >
                      <Eye size={12} />
                      View
                    </button>
                    <button
                      onClick={() => decide(r.Matriculation_Number, true)}
                      disabled={busyId === r.Matriculation_Number || r.status !== "pending"}
                      className="inline-flex items-center gap-1 bg-green-900/40 hover:bg-green-900/70 border border-green-900 text-green-300 px-3 py-1 rounded text-xs disabled:opacity-40"
                    >
                      {busyId === r.Matriculation_Number ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Check size={12} />
                      )}
                      Admit
                    </button>
                    <button
                      onClick={() => decide(r.Matriculation_Number, false)}
                      disabled={busyId === r.Matriculation_Number || r.status !== "pending"}
                      className="inline-flex items-center gap-1 bg-red-900/40 hover:bg-red-900/70 border border-red-900 text-red-300 px-3 py-1 rounded text-xs disabled:opacity-40"
                    >
                      <X size={12} />
                      Reject
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <ApplicantModal matric={viewMatric} onClose={() => setViewMatric(null)} />
    </DeskLayout>
  );
}
