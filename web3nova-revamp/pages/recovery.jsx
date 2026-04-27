import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Fingerprint, Loader2, CheckCircle2, AlertCircle, ShieldCheck, Hash, ArrowRight } from "lucide-react";
import { startRegistration, browserSupportsWebAuthn } from "@simplewebauthn/browser";
import Navbar from "@/components/Hero/navbar";
import Footer from "@/components/Footer";
import BackgroundEffects from "@/components/Services/BackgroundEffects";

const API = process.env.NEXT_PUBLIC_API_URL || "https://intership-server.onrender.com";

export default function Recovery() {
  const [step, setStep] = useState(1); // 1 = method selection, 2 = email recovery, 3 = matric update, 4 = passkey setup, 5 = success
  const [email, setEmail] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [recoveredMatric, setRecoveredMatric] = useState("");
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

  // Email-based recovery flow
  async function handleEmailRecovery(e) {
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

      // Store recovered matric and proceed to passkey setup
      setRecoveredMatric(startData.Matriculation_Number);
      setStep(4); // Go to passkey setup step
    } catch {
      setStatus({ type: "error", message: "Network error. Try again." });
    } finally {
      setLoading(false);
    }
  }

  // Matric-based update flow
  async function handleMatricUpdate(e) {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!matricNumber.trim()) {
      setStatus({ type: "error", message: "Enter your matric number." });
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
      const updateRes = await fetch(`${API}/passkey/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Matriculation_Number: matricNumber.trim() }),
      });
      const updateData = await updateRes.json().catch(() => ({}));
      if (!updateRes.ok) {
        setStatus({ type: "error", message: updateData.error || "Cannot update passkey." });
        return;
      }

      // Store matric and proceed to passkey setup
      setRecoveredMatric(updateData.Matriculation_Number);
      setStep(4); // Go to passkey setup step
    } catch {
      setStatus({ type: "error", message: "Network error. Try again." });
    } finally {
      setLoading(false);
    }
  }

  // Complete passkey registration after options retrieved
  async function handleCreatePasskey() {
    setStatus({ type: "", message: "" });

    if (!recoveredMatric) {
      setStatus({ type: "error", message: "Matric number not found." });
      return;
    }

    setLoading(true);
    try {
      // Get registration options
      const optsRes = await fetch(`${API}/passkey/register/options`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Matriculation_Number: recoveredMatric,
          allowReplace: true,
        }),
      });
      const opts = await optsRes.json().catch(() => ({}));
      if (!optsRes.ok) {
        setStatus({ type: "error", message: opts.error || "Couldn't start passkey setup." });
        return;
      }

      // Start WebAuthn registration ceremony
      let attResp;
      try {
        attResp = await startRegistration({ optionsJSON: opts });
      } catch (err) {
        const msg = err?.name === "NotAllowedError"
          ? "Passkey setup was cancelled or timed out. Try again."
          : err?.message || "Passkey setup failed.";
        setStatus({ type: "error", message: msg });
        return;
      }

      // Verify the registration
      const verRes = await fetch(`${API}/passkey/register/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Matriculation_Number: recoveredMatric,
          response: attResp,
        }),
      });
      const verData = await verRes.json().catch(() => ({}));
      if (!verRes.ok || !verData.verified) {
        setStatus({ type: "error", message: verData.error || "Verification failed." });
        return;
      }

      // Success!
      setDone(true);
      setStep(5);
    } catch {
      setStatus({ type: "error", message: "Network error during passkey setup. Try again." });
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

        <div className="max-w-2xl mx-auto px-6 relative z-10">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <Fingerprint className="w-4 h-4" />
              <span>Passkey Recovery</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">
              <span className="bg-gradient-to-b from-blue-400 via-blue-600 to-blue-800 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                {step === 5 ? "All Set" : "Update"}
              </span>{" "}
              <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                {step === 5 ? "✓" : "Your Passkey"}
              </span>
            </h1>
            <p className="text-gray-400">
              {step === 1 && "Choose how to recover your passkey. Admin must reset your old one first."}
              {step === 2 && "Enter the email you applied with."}
              {step === 3 && "Enter your matric number directly."}
              {step === 4 && "Use your fingerprint, Face ID, or device unlock."}
              {step === 5 && "You can now check in and out at the hub."}
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-600 to-blue-900 rounded-3xl blur opacity-25" />
            <div className="relative bg-[#0a0a1a] border border-white/10 rounded-3xl p-8 md:p-10">
              <AnimatePresence mode="wait">
                {status.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
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

              <AnimatePresence mode="wait">
                {/* Step 1: Method Selection */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-gray-300 flex items-start gap-3 mb-6">
                      <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                      <p>Your old passkey must be reset by an admin before this will work.</p>
                    </div>

                    <motion.button
                      onClick={() => setStep(2)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5" />
                        <span>Email Recovery</span>
                      </div>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    <motion.button
                      onClick={() => setStep(3)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-8 py-5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(147,51,234,0.4)] transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <Hash className="w-5 h-5" />
                        <span>Matric Number</span>
                      </div>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    <p className="text-center text-xs text-gray-500 mt-6">
                      Tip: Matric number recovery is faster and requires no email lookup.
                    </p>
                  </motion.div>
                )}

                {/* Step 2: Email Recovery */}
                {step === 2 && (
                  <motion.form
                    key="step2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={handleEmailRecovery}
                    className="space-y-6"
                  >
                    <div>
                      <label className="flex items-center gap-2 text-gray-400 text-sm uppercase tracking-widest mb-3">
                        <Mail className="w-4 h-4" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full bg-black/40 border border-white/10 focus:border-blue-500 focus:outline-none rounded-xl px-5 py-4 text-white placeholder-gray-600 transition-colors"
                      />
                      <p className="text-xs text-gray-500 mt-2">The email you used to apply.</p>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {loading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Looking up email…</>
                      ) : (
                        <><Mail className="w-5 h-5" /> Continue</>
                      )}
                    </motion.button>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      ← Back
                    </button>
                  </motion.form>
                )}

                {/* Step 3: Matric Update */}
                {step === 3 && (
                  <motion.form
                    key="step3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={handleMatricUpdate}
                    className="space-y-6"
                  >
                    <div>
                      <label className="flex items-center gap-2 text-gray-400 text-sm uppercase tracking-widest mb-3">
                        <Hash className="w-4 h-4" />
                        Matriculation Number *
                      </label>
                      <input
                        type="text"
                        value={matricNumber}
                        onChange={(e) => setMatricNumber(e.target.value)}
                        placeholder="IFT/18/1234"
                        className="w-full bg-black/40 border border-white/10 focus:border-purple-500 focus:outline-none rounded-xl px-5 py-4 text-white placeholder-gray-600 transition-colors uppercase"
                      />
                      <p className="text-xs text-gray-500 mt-2">Your unique matric number from your application.</p>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(147,51,234,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {loading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Validating…</>
                      ) : (
                        <><Hash className="w-5 h-5" /> Continue</>
                      )}
                    </motion.button>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      ← Back
                    </button>
                  </motion.form>
                )}

                {/* Step 4: Passkey Setup */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col items-center text-center py-4">
                      <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                        <Fingerprint className="w-10 h-10 text-blue-400" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Matric: {recoveredMatric}</h2>
                      <p className="text-gray-400 max-w-md mb-8">
                        Now create a passkey using your fingerprint, Face ID, or device unlock.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/30 p-5 space-y-3 text-sm text-gray-300">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <p>Your passkey stays on this device. We never see your fingerprint or face data.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <p>If you lose this device later, an admin can reset it again.</p>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      onClick={handleCreatePasskey}
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {loading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Waiting for device…</>
                      ) : (
                        <><Fingerprint className="w-5 h-5" /> Create Passkey</>
                      )}
                    </motion.button>
                  </motion.div>
                )}

                {/* Step 5: Success */}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle2 className="w-10 h-10 text-green-400" />
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-3">Passkey Updated!</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                      Your new passkey is ready. You can now check in and out at the hub using this device.
                    </p>
                    <a
                      href="/internship"
                      className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl font-bold hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all"
                    >
                      Back to Hub
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
