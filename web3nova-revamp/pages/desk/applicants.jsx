import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Loader2, RefreshCw, AlertCircle, Eye, Trash2 } from "lucide-react";
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
  const [toDelete, setToDelete] = useState(null);

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

  async function confirmDelete() {
    const r = toDelete;
    if (!r) return;
    setBusyId(r.Matriculation_Number || `id-${r.id}`);
    try {
      const qs = r.Matriculation_Number
        ? `matric=${encodeURIComponent(r.Matriculation_Number)}`
        : `id=${r.id}`;
      await deskFetch(`/applicant?${qs}`, { method: "DELETE" });
      setRows((rs) => rs.filter((x) => x.id !== r.id));
      setToDelete(null);
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
                    <button
                      onClick={() => setToDelete(r)}
                      disabled={busyId === (r.Matriculation_Number || `id-${r.id}`)}
                      className="inline-flex items-center gap-1 bg-zinc-900/60 hover:bg-red-900/50 border border-zinc-800 hover:border-red-900 text-zinc-400 hover:text-red-300 px-3 py-1 rounded text-xs disabled:opacity-40"
                      title="Delete permanently"
                    >
                      {busyId === (r.Matriculation_Number || `id-${r.id}`) ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Trash2 size={12} />
                      )}
                      Delete
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <ApplicantModal matric={viewMatric} onClose={() => setViewMatric(null)} />

      {toDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-md w-full p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-950/50 border border-red-900 flex items-center justify-center shrink-0">
                <Trash2 size={18} className="text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg">Delete applicant?</h3>
                <p className="text-zinc-400 text-sm mt-1">
                  This permanently removes{" "}
                  <span className="text-white font-medium">
                    {toDelete.full_name || toDelete.Matriculation_Number || `id ${toDelete.id}`}
                  </span>
                  {" "}and any attendance records. Cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setToDelete(null)}
                disabled={busyId}
                className="px-4 py-2 text-sm bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-300 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={busyId}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-red-900/60 hover:bg-red-900 border border-red-900 rounded-lg text-red-100 disabled:opacity-40"
              >
                {busyId ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DeskLayout>
  );
}
