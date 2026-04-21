import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  LogIn,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  Sparkles,
  Loader2,
} from "lucide-react";
import BackgroundEffects from "../Services/BackgroundEffects";

const API = process.env.NEXT_PUBLIC_API_URL || "https://<your-render-url>";

const formatTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

export default function Attendance() {
  const [matric, setMatric] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info"); // info | success | error
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  async function loadStatus() {
    if (!matric.trim()) {
      setMsgType("error");
      setMsg("Enter your matric number.");
      return;
    }
    setMsg("");
    setLoading(true);
    try {
      const r = await fetch(
        `${API}/attendance/status?matric=${encodeURIComponent(matric.trim())}`
      );
      if (r.status === 403) {
        setMsgType("error");
        setMsg("You must be on hub WiFi to check in.");
        return;
      }
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        setMsgType("error");
        setMsg(data.error || "Something went wrong.");
        return;
      }
      setStatus(await r.json());
    } catch (err) {
      setMsgType("error");
      setMsg("Network error — are you connected to hub WiFi?");
    } finally {
      setLoading(false);
    }
  }

  async function act(method, path, successFn) {
    setLoading(true);
    setMsg("");
    try {
      const r = await fetch(`${API}${path}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Matriculation_Number: matric.trim() }),
      });
      const data = await r.json();
      if (r.ok) {
        setMsgType("success");
        setMsg(successFn(data));
        await loadStatus();
      } else {
        setMsgType("error");
        setMsg(data.error || "Request failed.");
      }
    } catch {
      setMsgType("error");
      setMsg("Network error.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStatus(null);
    setMatric("");
    setMsg("");
  }

  return (
    <div
      className="relative min-h-screen text-white overflow-hidden pb-20 pt-32 md:pt-40"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <BackgroundEffects />
      <div className="absolute inset-0 -z-10 bg-[#000000]" />
      <motion.div
        className="absolute inset-0 -z-10 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle 600px at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 88, 240, 0.15), transparent 60%)`,
        }}
      />

      <div className="max-w-2xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Intern Attendance</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter">
            <span className="bg-gradient-to-b from-blue-400 via-blue-600 to-blue-800 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]">
              Check
            </span>{" "}
            <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              In / Out
            </span>
          </h1>

          <p className="text-gray-400 text-lg">
            Mon–Thu · 10:00 – 17:00 · On-site only
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-600 to-blue-900 rounded-3xl blur opacity-25"></div>
          <div className="relative bg-[#0a0a1a] border border-white/10 rounded-3xl p-8 md:p-12">
            <AnimatePresence mode="wait">
              {!status ? (
                <motion.div
                  key="matric"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <label className="flex items-center gap-2 text-gray-400 text-sm uppercase tracking-widest mb-3">
                    <User className="w-4 h-4" />
                    Matriculation Number
                  </label>
                  <input
                    value={matric}
                    onChange={(e) => setMatric(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && loadStatus()}
                    placeholder="e.g. IFT/18/1234"
                    className="w-full bg-black/40 border border-white/10 focus:border-blue-500 focus:outline-none rounded-xl px-5 py-4 text-lg text-white placeholder-gray-600 transition-colors"
                  />
                  <motion.button
                    onClick={loadStatus}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="mt-6 w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Checking…
                      </>
                    ) : (
                      <>Continue</>
                    )}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="status"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <StatusPanel
                    status={status}
                    matric={matric}
                    loading={loading}
                    onCheckIn={() =>
                      act("POST", "/attendance/check-in", (d) => `Checked in at ${formatTime(d.time_in)}. Have a great day.`)
                    }
                    onCheckOut={() =>
                      act("PATCH", "/attendance/check-out", (d) => `Checked out — ${d.hours} hours today.`)
                    }
                    onReset={reset}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message banner */}
            <AnimatePresence>
              {msg && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-6 p-4 rounded-xl border flex items-start gap-3 ${
                    msgType === "success"
                      ? "bg-green-500/10 border-green-500/30 text-green-300"
                      : msgType === "error"
                      ? "bg-red-500/10 border-red-500/30 text-red-300"
                      : "bg-blue-500/10 border-blue-500/30 text-blue-300"
                  }`}
                >
                  {msgType === "success" ? (
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm">{msg}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <p className="text-center text-gray-600 text-xs mt-8">
          Attendance is verified by the hub network. Off-site check-ins are blocked.
        </p>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap");
      `}</style>
    </div>
  );
}

function StatusPanel({ status, matric, loading, onCheckIn, onCheckOut, onReset }) {
  if (!status.found) {
    return (
      <PanelMessage
        icon={<AlertCircle className="w-8 h-8 text-red-400" />}
        title="Matric not found"
        detail={`We couldn't find "${matric}" in the cohort. Check spelling and try again.`}
        onReset={onReset}
        resetLabel="Try again"
      />
    );
  }

  if (!status.admitted) {
    return (
      <PanelMessage
        icon={<AlertCircle className="w-8 h-8 text-yellow-400" />}
        title="Not admitted"
        detail="Your application has been received but you haven't been admitted to this cohort yet."
        onReset={onReset}
        resetLabel="Use a different matric"
      />
    );
  }

  if (!status.is_workday) {
    return (
      <PanelMessage
        icon={<Calendar className="w-8 h-8 text-blue-400" />}
        title="No attendance today"
        detail="Attendance runs Mon–Thu only. See you next workday."
        onReset={onReset}
        resetLabel="Use a different matric"
      />
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2 text-sm text-gray-500 uppercase tracking-widest">
        <User className="w-4 h-4" />
        {matric}
      </div>

      {status.state === "not_checked_in" && (
        <>
          <h2 className="text-3xl font-bold mb-2">Ready to check in</h2>
          <p className="text-gray-400 mb-8">Tap the button below when you arrive at the hub.</p>
          <motion.button
            onClick={onCheckIn}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full px-8 py-5 bg-gradient-to-r from-green-600 to-emerald-400 text-white rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
            Check In
          </motion.button>
        </>
      )}

      {status.state === "checked_in" && (
        <>
          <h2 className="text-3xl font-bold mb-2">You're checked in</h2>
          <div className="flex items-center gap-2 text-gray-400 mb-8">
            <Clock className="w-4 h-4" />
            Since {formatTime(status.time_in)}
          </div>
          <motion.button
            onClick={onCheckOut}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full px-8 py-5 bg-gradient-to-r from-red-600 to-orange-400 text-white rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
            Check Out
          </motion.button>
        </>
      )}

      {status.state === "checked_out" && (
        <PanelMessage
          icon={<CheckCircle2 className="w-8 h-8 text-green-400" />}
          title="All done for today"
          detail={`You checked out at ${formatTime(status.time_out)}. See you tomorrow.`}
          onReset={onReset}
          resetLabel="Switch matric"
        />
      )}

      <button
        onClick={onReset}
        className="mt-6 w-full text-sm text-gray-500 hover:text-gray-300 transition-colors"
      >
        ← Use a different matric
      </button>
    </div>
  );
}

function PanelMessage({ icon, title, detail, onReset, resetLabel }) {
  return (
    <div className="text-center py-6">
      <div className="flex justify-center mb-4">{icon}</div>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-400 mb-8">{detail}</p>
      <button
        onClick={onReset}
        className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
      >
        {resetLabel}
      </button>
    </div>
  );
}
