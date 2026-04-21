import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import BackgroundEffects from "../Services/BackgroundEffects";
import { useRouter } from "next/router";

const SuccessPage = () => {
  const router = useRouter();
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

  return (
    <div
      className="relative min-h-screen text-white overflow-hidden flex items-center justify-center pt-20"
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

      <div className="max-w-xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 mb-8"
        >
          <CheckCircle2 className="w-12 h-12 text-green-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter"
        >
          Application <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Received!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-lg md:text-xl mb-12"
        >
          Thank you for applying to the Web3Nova SIWES program. Your application has been successfully submitted and is currently pending review. You'll be notified via email if admitted.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => router.push('/')}
            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            Back to Home
          </button>
          <button
            onClick={() => router.push('/internship')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-2xl font-bold hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2 group"
          >
            Internship Hub
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPage;