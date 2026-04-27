import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, GraduationCap, MapPin, Phone, Twitter, Sparkles, Send } from "lucide-react";
import BackgroundEffects from "../Services/BackgroundEffects";
import { useRouter } from "next/router";

const InternshipPage = () => {
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

  const departments = [
    "Computer Science",
    "Computer Engineering",
    "Software Engineering",
    "Cyber Security",
    "Statistics",
    "Information Tech.",
  ];

  const gains = [
    "Hands-on industry experience",
    "Professional mentorship",
    "Skill development",
    "Real project exposure",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Admitted Interns State
  const [interns, setInterns] = useState([]);
  const [loadingInterns, setLoadingInterns] = useState(true);
  const [internsError, setInternsError] = useState("");

  useEffect(() => {
    async function fetchInterns() {
      setLoadingInterns(true);
      setInternsError("");
      try {
        const res = await fetch("https://intership-server.onrender.com/interns");
        if (!res.ok) throw new Error("Failed to fetch interns");
        const data = await res.json();
        setInterns(data);
      } catch (err) {
        setInternsError("Could not load admitted interns.");
      } finally {
        setLoadingInterns(false);
      }
    }
    fetchInterns();
  }, []);

  return (
    <div
      className="relative min-h-screen text-white overflow-hidden pb-20 pt-32 md:pt-40"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <BackgroundEffects />

      {/* 🌌 Cosmic Background */}
      <div className="absolute inset-0 -z-10 bg-[#000000]" />

      {/* Interactive Gradient Overlay */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle 600px at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 88, 240, 0.15), transparent 60%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Opportunities for Growth</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tighter">
            <span className="bg-linear-to-b from-blue-400 via-blue-600 to-blue-800 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]">
              SIWES
            </span>
            <br />
            <span className="bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Application
            </span>
          </h1>
          
          <motion.div 
            className="text-2xl md:text-3xl text-gray-400 font-light flex items-center justify-center gap-3"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="h-px w-8 bg-blue-500/50"></span>
            Now open
            <span className="h-px w-8 bg-blue-500/50"></span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8"
          >
            <button 
              className="px-12 py-5 bg-linear-to-r from-[#2E7BD1] to-[#92B4E4] text-white rounded-2xl font-bold text-xl hover:shadow-[0_0_40px_rgba(46,123,209,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
              style={{
                boxShadow: "0 10px 30px rgba(46, 123, 209, 0.3)",
              }}
              onClick={() => router.push('/internship/apply')}
            >
              Apply Now
            </button>
          </motion.div>
        </motion.div>


        {/* Admitted Interns Section - Horizontal Scroll, No Title/Skill, Goal Label */}
        <section className="relative z-10 py-20 overflow-x-hidden">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm mb-2">
              <CheckCircle2 className="w-4 h-4 text-[#2B6EFF]" />
              <span className="text-sm text-gray-300 font-['Inter'] uppercase tracking-widest">Admitted Interns</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-['Space_Grotesk']">Meet the Admitted Interns</h2>
          </div>
          {loadingInterns ? (
            <div className="flex justify-center items-center py-12">
              <span className="text-blue-400 text-lg animate-pulse">Loading interns…</span>
            </div>
          ) : internsError ? (
            <div className="flex justify-center items-center py-12">
              <span className="text-red-400 text-lg">{internsError}</span>
            </div>
          ) : interns.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <span className="text-gray-400 text-lg">No admitted interns yet.</span>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-8 py-4 animate-scroll-interns whitespace-nowrap">
                {[...interns, ...interns].map((intern, idx) => (
                  <motion.div
                    key={intern.id + '-' + idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (idx % interns.length) * 0.05 }}
                    className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 min-w-[280px] max-w-xs mx-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    <div className="absolute top-6 left-6 opacity-10">
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-blue-500/30 bg-blue-900/10 flex items-center justify-center shadow-lg">
                      <img
                        src={intern.photo_url || "/default-avatar.png"}
                        alt={intern.full_name}
                        className="object-cover w-full h-full"
                        style={{ minHeight: "80px", minWidth: "80px" }}
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-1 text-blue-400 truncate">{intern.full_name}</h3>
                    <div className="text-sm text-gray-400 mb-1 break-words whitespace-normal max-w-[180px]" style={{wordBreak: 'break-word'}}>{intern.Department}</div>
                    <div className="mt-1 text-xs text-blue-500/70 mb-2">Cohort {intern.cohort_year}</div>
                    <div className="w-full text-left text-gray-300 text-base italic mb-2 whitespace-normal break-words">
                      <span className="font-semibold text-white">Goal:</span> {intern.expectations}
                    </div>
                  </motion.div>
                ))}
              </div>
              <style jsx>{`
                @keyframes scroll-interns {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-33.333%); }
                }
                .animate-scroll-interns {
                  animation: scroll-interns 60s linear infinite;
                  width: fit-content;
                  display: flex;
                }
                .animate-scroll-interns:hover {
                  animation-play-state: paused;
                }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
              `}</style>
            </div>
          )}
        </section>

        {/* Content Grid */}
        <motion.div 
          className="grid md:grid-cols-2 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Departments Card */}
          <motion.div 
            variants={itemVariants}
            className="group relative h-full"
          >
            <div className="absolute -inset-0.5 bg-linear-to-b from-blue-600 to-blue-900 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative h-full bg-[#0a0a1a] border border-white/10 p-8 md:p-12 rounded-3xl overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <GraduationCap className="w-32 h-32" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                   <GraduationCap className="w-6 h-6" />
                </span>
                Open for Students
              </h2>
              <p className="text-gray-400 mb-8 italic">in departments relating to:</p>
              
              <ul className="space-y-4">
                {departments.map((dept, i) => (
                  <motion.li 
                    key={dept} 
                    className="flex items-center gap-3 text-lg text-gray-300 group/item"
                    whileHover={{ x: 10 }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 transition-all group-hover/item:w-4 group-hover/item:bg-blue-400 underline-offset-4"></span>
                    {dept}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Gains Card */}
          <motion.div 
            variants={itemVariants}
            className="group relative h-full"
          >
            <div className="absolute -inset-0.5 bg-linear-to-b from-yellow-600 to-yellow-900 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative h-full bg-[#0a0a1a] border border-white/10 p-8 md:p-12 rounded-3xl overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <CheckCircle2 className="w-32 h-32" />
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
                 <span className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400">
                   <CheckCircle2 className="w-6 h-6" />
                </span>
                What You'll Gain
              </h2>
              <p className="text-gray-400 mb-8 italic">unparalleled industry exposure:</p>

              <ul className="space-y-6">
                {gains.map((gain, i) => (
                  <motion.li 
                    key={gain} 
                    className="flex items-start gap-4 text-lg text-gray-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="mt-1 shrink-0 w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    </div>
                    {gain}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer Info / Registration */}
        <motion.div 
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-blue-600/10 blur-3xl -z-10 rounded-full"></div>
          
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 text-center md:flex md:flex-col md:items-center">
            <h3 className="text-xl md:text-2xl text-white mb-4 flex items-center justify-center gap-2">
               Monthly stipend available. <span className="text-blue-400 font-bold">T&C applies</span>
            </h3>

            <div className="h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent my-8"></div>

            <div className="grid md:grid-cols-3 gap-8 w-full">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm uppercase tracking-widest mb-1">How to register</p>
                  <p className="text-lg font-semibold text-white">Send DM to<br/>07043314162</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm uppercase tracking-widest mb-1">Our Location</p>
                  <p className="text-lg font-semibold text-white">FUTA South gate</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-500/10 flex items-center justify-center text-gray-400">
                  <Twitter className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm uppercase tracking-widest mb-1">Connect with us</p>
                  <p className="text-lg font-semibold text-white">@Web3Nova</p>
                </div>
              </div>
            </div>

            <motion.button 
              className="mt-12 px-10 py-4 bg-linear-to-r from-blue-600 to-blue-400 text-white rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all flex items-center gap-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/internship/apply')}
            >
              Apply Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InternshipPage;
