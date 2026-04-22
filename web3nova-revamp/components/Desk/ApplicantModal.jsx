import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, User, Mail, Phone, MapPin, Briefcase, Users, Calendar, Hash, Fingerprint, ShieldAlert } from "lucide-react";
import { deskFetch } from "@/lib/deskApi";

export default function ApplicantModal({ matric, onClose }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState("");

  useEffect(() => {
    if (!matric) return;
    setData(null);
    setError("");
    setConfirmReset(false);
    setResetMsg("");
    deskFetch(`/applicant?matric=${encodeURIComponent(matric)}`)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [matric]);

  async function resetPasskey() {
    if (!data?.id) return;
    setResetting(true);
    setResetMsg("");
    try {
      const r = await deskFetch(`/passkey/${data.id}`, { method: "DELETE" });
      setResetMsg(`Cleared ${r.cleared} passkey(s). They can now re-register via /recovery.`);
      setConfirmReset(false);
    } catch (err) {
      setResetMsg(err.message);
    } finally {
      setResetting(false);
    }
  }

  return (
    <AnimatePresence>
      {matric && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-auto"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 sticky top-0 bg-zinc-950">
              <h2 className="font-semibold">Applicant Details</h2>
              <button onClick={onClose} className="text-zinc-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              {!data && !error && (
                <div className="flex items-center justify-center py-16 text-zinc-500">
                  <Loader2 className="animate-spin mr-2" size={18} /> Loading…
                </div>
              )}

              {data && (
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-zinc-900 overflow-hidden flex items-center justify-center shrink-0">
                      {data.photo_url ? (
                        <img src={data.photo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} className="text-zinc-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-lg font-semibold">{data.full_name}</div>
                      <div className="text-xs font-mono text-zinc-500">{data.Matriculation_Number}</div>
                      <div className="mt-1">
                        {data.status === "admitted" ? (
                          <span className="text-green-400 text-xs bg-green-950/40 px-2 py-0.5 rounded">admitted</span>
                        ) : data.status === "rejected" ? (
                          <span className="text-red-400 text-xs bg-red-950/40 px-2 py-0.5 rounded">rejected</span>
                        ) : (
                          <span className="text-amber-400 text-xs bg-amber-950/40 px-2 py-0.5 rounded">pending</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <Field icon={Mail} label="Email" value={data.email} />
                    <Field icon={Phone} label="Phone" value={data.phone_number} />
                    <Field icon={Users} label="Parent contact" value={data.Parent_contact} />
                    <Field icon={Briefcase} label="Department" value={data.Department} />
                    <Field icon={MapPin} label="Address" value={data.ADDRESS} />
                    <Field icon={Calendar} label="Applied" value={new Date(data.created_at).toLocaleString()} />
                  </div>

                  <Block label="Skills" value={data.skills} />
                  <Block label="Bio" value={data.bio} />
                  <Block label="Expectations" value={data.expectations} />

                  <div className="pt-4 mt-2 border-t border-zinc-900">
                    <div className="text-xs text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <Fingerprint size={12} /> Passkey
                    </div>
                    {!confirmReset ? (
                      <div className="flex items-center justify-between gap-3 bg-zinc-900/50 border border-zinc-900 rounded-lg px-3 py-3">
                        <p className="text-sm text-zinc-400">
                          Reset this intern's passkey so they can re-register a new device at <span className="font-mono text-zinc-300">/recovery</span>.
                        </p>
                        <button
                          onClick={() => setConfirmReset(true)}
                          className="shrink-0 inline-flex items-center gap-1 bg-amber-900/40 hover:bg-amber-900/70 border border-amber-900 text-amber-200 px-3 py-1.5 rounded text-xs"
                        >
                          <ShieldAlert size={12} /> Reset passkey
                        </button>
                      </div>
                    ) : (
                      <div className="bg-amber-950/30 border border-amber-900/50 rounded-lg p-3">
                        <p className="text-sm text-amber-200 mb-3">
                          Clear passkey for <span className="font-medium">{data.full_name}</span>? They'll have to set up a new one via /recovery.
                        </p>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setConfirmReset(false)}
                            disabled={resetting}
                            className="px-3 py-1.5 text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-300 disabled:opacity-40"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={resetPasskey}
                            disabled={resetting}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-amber-900/60 hover:bg-amber-900 border border-amber-900 rounded text-amber-100 disabled:opacity-40"
                          >
                            {resetting ? <Loader2 size={12} className="animate-spin" /> : <ShieldAlert size={12} />}
                            Confirm reset
                          </button>
                        </div>
                      </div>
                    )}
                    {resetMsg && (
                      <p className="text-xs text-zinc-400 mt-2">{resetMsg}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ icon: Icon, label, value }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-900 rounded-lg px-3 py-2">
      <div className="text-xs text-zinc-500 flex items-center gap-1 mb-0.5">
        <Icon size={12} /> {label}
      </div>
      <div className="text-zinc-200 break-words">{value || <span className="text-zinc-600">—</span>}</div>
    </div>
  );
}

function Block({ label, value }) {
  return (
    <div>
      <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-sm text-zinc-300 bg-zinc-900/50 border border-zinc-900 rounded-lg px-3 py-2 whitespace-pre-wrap">
        {value || <span className="text-zinc-600">—</span>}
      </div>
    </div>
  );
}
