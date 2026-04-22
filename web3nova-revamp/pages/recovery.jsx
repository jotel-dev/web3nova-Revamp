import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Fingerprint, Loader2, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";
import { startRegistration, browserSupportsWebAuthn } from "@simplewebauthn/browser";
import Navbar from "@/components/Hero/navbar";
import Footer from "@/components/Footer";
import BackgroundEffects from "@/components/Services/BackgroundEffects";

const API = process.env.NEXT_PUBLIC_API_URL || "https://intership-server.onrender.com";

export default function Recovery() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [done, setDone] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) =>
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  async function handleRecover(e) {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!email.trim()) {
      setStatus({ type: "error", message: "Enter your email." });
      return;
    }
    if (!browserSupportsWebAuthn()) {
      setStatus({
        type: "error",
        message: "This browser doesn't support passkeys. Use a phone or laptop with biometric unlock.",
      });
      return;
    }

    setLoading(true);
    try {
      const startRes = await fetch(`${API}/passkey/recovery/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const startData = await startRes.json().catch(() => ({}));
      if (!startRes.ok) {
        setStatus({ type: "error", message: startData.error || "Cannot proceed with this email." });
        return;
      }

      let attResp;
      try {
        attResp = await startRegistration({ optionsJSON: startData.options });
      } catch (err) {
        const msg = err?.name === "NotAllowedError"
          ? "Passkey setup was cancelled or timed out."
          : err?.message || "Passkey setup failed.";
        setStatus({ type: "error", message: msg });
        return;
      }

      const verRes = await fetch(`${API}/passkey/register/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Matriculation_Number: startData.Matriculation_Number,
          response: attResp,
        }),
      });
      const verData = await verRes.json().catch(() => ({}));
      if (!verRes.ok || !verData.verified) {
        setStatus({ type: "error", message: verData.error || "Verification failed." });
        return;
      }

      setDone(true);
    } catch {
      setStatus({ type: "error", message: "Network error. Try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <Navbar />
      <div className="relative min-h-screen pt-32 md:pt-40 pb-20" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        <BackgroundEffects />
        <motion.div
          className="absolute inset-0 -z-10 opacity-30 pointer-events-none"
          style={{
            background: `radial-gradient(circle 600px at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 88, 240, 0.15), transparent 60%)`,
          }}
        />

        <div className="max-w-xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <Fingerprint className="w-4 h-4" />
              <span>Passkey Recovery</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">
              <span className="bg-gradient-to-b from-blue-400 via-blue-600 to-blue-800 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                Register
              </span>{" "}
              <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                a new passkey
              </span>
            </h1>
            <p className="text-gray-400">
              Lost your device? Ask the admin to reset your old passkey, then come back here.
            </p>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-600 to-blue-900 rounded-3xl blur opacity-25" />
            <div className="relative bg-[#0a0a1a] border border-white/10 rounded-3xl p-8 md:p-10">
              {done ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">New passkey registered</h2>
                  <p className="text-gray-400">
                    You can now check in and out at the hub using this device.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRecover} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {status.type && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-xl flex items-center gap-3 ${
                          status.type === "error"
                            ? "bg-red-500/10 border border-red-500/20 text-red-400"
                            : "bg-green-500/10 border border-green-500/20 text-green-400"
                        }`}
                      >
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm">{status.message}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label className="flex items-center gap-2 text-gray-400 text-sm uppercase tracking-widest mb-3">
                      <Mail className="w-4 h-4" />
                      Email on file
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="The email you applied with"
                      className="w-full bg-black/40 border border-white/10 focus:border-blue-500 focus:outline-none rounded-xl px-5 py-4 text-white placeholder-gray-600 transition-colors"
                    />
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-300 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <p>Your old passkey must be reset by an admin before this will work.</p>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Setting up…</>
                    ) : (
                      <><Fingerprint className="w-5 h-5" /> Register new passkey</>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
