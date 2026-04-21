import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Hash, Book, Briefcase, MapPin, Phone, Users, Image as ImageIcon, Loader2, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import BackgroundEffects from "../Services/BackgroundEffects";
import { useRouter } from "next/router";

const ApplicationForm = () => {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formState, setFormState] = useState({
    Matriculation_Number: "",
    full_name: "",
    email: "",
    Department: "",
    bio: "",
    skills: "",
    expectations: "",
    ADDRESS: "",
    phone_number: "",
    Parent_contact: "",
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const fileInputRef = useRef(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setStatus({ type: "error", message: "File size must be less than 5MB" });
        return;
      }
      setPhoto(file);
      setStatus({ type: "", message: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.full_name || !formState.email || !formState.Matriculation_Number || !formState.Department || !formState.phone_number || !formState.Parent_contact || !formState.ADDRESS || !formState.skills || !formState.bio || !formState.expectations || !photo) {
      setStatus({ type: "error", message: "Please fill in all required fields and upload a photo." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const formData = new FormData();
      Object.entries(formState).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (photo) {
        formData.append("photo", photo);
      }

      const response = await fetch("https://intership-server.onrender.com/form", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/internship/success');
      } else {
        let errorMessage = data.error || "Failed to submit application.";
        if (errorMessage.toLowerCase().includes("unique constraint failed") || errorMessage.toLowerCase().includes("duplicate")) {
          if (errorMessage.includes("email")) {
            errorMessage = "An application with this Email Address is already registered.";
          } else if (errorMessage.includes("Matriculation_Number") || errorMessage.includes("matric")) {
            errorMessage = "An application with this Matriculation Number is already registered.";
          } else {
            errorMessage = "You have already registered with these details.";
          }
        }
        setStatus({ type: "error", message: errorMessage });
      }
    } catch (error) {
      setStatus({ type: "error", message: "An error occurred. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

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

      <div className="max-w-4xl mx-auto px-6 relative z-10">
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
            <span>Join the Team</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tighter">
            <span className="bg-gradient-to-b from-blue-400 via-blue-600 to-blue-800 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]">
              Internship
            </span>{" "}
            <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Application
            </span>
          </h1>

          <p className="text-gray-400 text-lg">
            Apply to join our next cohort of interns.
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
              {status.type && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${
                    status.type === "success" 
                      ? "bg-green-500/10 border border-green-500/20 text-green-400"
                      : "bg-red-500/10 border border-red-500/20 text-red-400"
                  }`}
                >
                  {status.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                  <p>{status.message}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-gray-400 text-sm uppercase tracking-widest mb-3">
                    <User className="w-4 h-4" />
                    Full Name *
                  </label>
                  <input
                    required
                    name="full_name"
                    value={formState.full_name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="w-full bg-black/40 border border-white/10 focus:border-blue-500 focus:outline-none rounded-xl px-5 py-4 text-white placeholder-gray-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-gray-400 text-sm uppercase tracking-widest mb-3">
                    <Mail className="w-4 h-4" />
                    Email *
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className="w-full bg-black/40 border border-white/10 focus:border-blue-500 focus:outline-none rounded-xl px-5 py-4 text-white placeholder-gray-600 transition-colors"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-gray-400 text-sm uppercase tracking-widest mb-3">
                    <Hash className="w-4 h-4" />
                    Matriculation Number *
                  </label>
                  <input
                    required
                    name="Matriculation_Number"
                    value={formState.Matriculation_Number}
                    onChange={handleChange}
                    placeholder="IFT/18/1234"
                    className="w-full bg-black/40 border border-white/10 focus:border-blue-500 focus:outline-none rounded-xl px-5 py-4 text-white placeholder-gray-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-gray-400 text-sm uppercase tracking-widest mb-3">
                    <Book className="w-4 h-4" />
                    Department *
                  </label>
                  <input
                    required
                    name="Department"
                    value={formState.Department}
                    onChange={handleChange}
                    placeholder="Information Technology"
                    className="w-full bg-black/40 border border-white/10 focus:border-blue-500 focus:outline-none rounded-xl px-5 py-4 text-white placeholder-gray-600 transition-colors"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-gray-400 text-sm uppercase tracking-widest mb-3">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </label>
                  <input
                    required
                    name="phone_number"
                    value={formState.phone_number}
                    onChange={handleChange}
                    placeholder="08012345678"
                    className="w-full bg-black/40 border border-white/10 focus:border-blue-500 focus:outline-none rounded-xl px-5 py-4 text-white placeholder-gray-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-gray-400 text-sm uppercase tracking-widest mb-3">
                    <Users className="w-4 h-4" />
                    Parent/Guardian Contact *
                  </label>
                  <input
                    required
                    name="Parent_contact"
                    value={formState.Parent_contact}
                    onChange={handleChange}
                    placeholder="08098765432"
                    className="w-full bg-black/40 border border-white/10 focus:border-blue-500 focus:outline-none rounded-xl px-5 py-4 text-white placeholder-gray-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm uppercase tracking-widest mb-3">
                  <MapPin className="w-4 h-4" />
                  Residential Address *
                </label>
                <input
                  required
                  name="ADDRESS"
                  value={formState.ADDRESS}
                  onChange={handleChange}
                  placeholder="Your address in Akure"
                  className="w-full bg-black/40 border border-white/10 focus:border-blue-500 focus:outline-none rounded-xl px-5 py-4 text-white placeholder-gray-600 transition-colors"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm uppercase tracking-widest mb-3">
                  <Briefcase className="w-4 h-4" />
                  Skills *
                </label>
                <input
                  required
                  name="skills"
                  value={formState.skills}
                  onChange={handleChange}
                  placeholder="e.g. react, typescript, designing"
                  className="w-full bg-black/40 border border-white/10 focus:border-blue-500 focus:outline-none rounded-xl px-5 py-4 text-white placeholder-gray-600 transition-colors"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm uppercase tracking-widest mb-3">
                  <User className="w-4 h-4" />
                  Bio *
                </label>
                <textarea
                  required
                  name="bio"
                  value={formState.bio}
                  onChange={handleChange}
                  placeholder="Tell us a little about yourself"
                  rows={3}
                  className="w-full bg-black/40 border border-white/10 focus:border-blue-500 focus:outline-none rounded-xl px-5 py-4 text-white placeholder-gray-600 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm uppercase tracking-widest mb-3">
                  <Sparkles className="w-4 h-4" />
                  Expectations *
                </label>
                <textarea
                  required
                  name="expectations"
                  value={formState.expectations}
                  onChange={handleChange}
                  placeholder="What do you expect to learn or achieve?"
                  rows={3}
                  className="w-full bg-black/40 border border-white/10 focus:border-blue-500 focus:outline-none rounded-xl px-5 py-4 text-white placeholder-gray-600 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-400 text-sm uppercase tracking-widest mb-3">
                  <ImageIcon className="w-4 h-4" />
                  Photo (Max 5MB) *
                </label>
                <input
                  required
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="w-full text-gray-400 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 transition-all cursor-pointer bg-black/40 border border-white/10 rounded-xl focus:outline-none p-2"
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="mt-8 w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>Submit Application</>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ApplicationForm;