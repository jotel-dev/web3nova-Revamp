import { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Loader2, LogIn, AlertCircle } from "lucide-react";
import { login } from "@/lib/deskApi";

export default function DeskLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.push("/desk/applicants");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-semibold text-white mb-2">Desk</h1>
          <p className="text-sm text-zinc-400 mb-6">Web3Nova internal console</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-zinc-600"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-medium rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 hover:bg-zinc-200 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
              Sign in
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
