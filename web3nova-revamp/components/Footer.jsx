import { useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, ArrowRight } from "lucide-react";

const XIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const Footer = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const footerLinks = {
    academy: [
      { name: "Course Tracks", href: "/training" },
      { name: "Curriculum", href: "/training" },
      { name: "Enrollment", href: "/register" },
      { name: "Alumni Network", href: "#alumniandsuccess" },
      { name: "Success Stories", href: "#alumniandsuccess" },
    ],
    services: [
      { name: "Web Development", href: "#web-dev" },
      { name: "UI/UX Design", href: "#design" },
      { name: "Blockchain Integration", href: "#blockchain" },
      { name: "Consultation", href: "#consulting" },
      { name: "Portfolio", href: "#portfolio" },
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Our Team", href: "#team" },
      { name: "Careers", href: "/training" },
      { name: "Partners", href: "/#partners" },
      { name: "Blog", href: "#blog" },
    ],
    resources: [
      { name: "Events", href: "/events" },
      { name: "Buildathons", href: "#buildathons" },
      { name: "Community", href: "#community" },
      { name: "Documentation", href: "#docs" },
      { name: "Support", href: "#support" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", icon: XIcon, href: "https://twitter.com" },
    { name: "LinkedIn", icon: LinkedinIcon, href: "https://linkedin.com" },
    { name: "Github", icon: GithubIcon, href: "https://github.com" },
    { name: "Telegram", icon: Send, href: "https://telegram.org" },
  ];

  return (
    <footer className="relative bg-[#0C0C0C] border-t border-white/5 overflow-hidden">
      <style>{`
        @keyframes float-slow { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(50px, 50px) scale(1.1); } }
        @keyframes float-medium { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-40px, 40px) scale(1.15); } }
        @keyframes float-fast { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(30px, -30px) scale(1.2); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.5); } }
        @keyframes gradient-shift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(100px, 100px); } }
        @keyframes grid-flow { 0% { transform: translate(0, 0); } 100% { transform: translate(50px, 50px); } }
      `}</style>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20">
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(74, 144, 226, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 144, 226, 0.3) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
              maskImage:
                "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
              animation: "grid-flow 20s linear infinite",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: "25%",
            left: "-8rem",
            width: "24rem",
            height: "24rem",
            borderRadius: "9999px",
            filter: "blur(80px)",
            opacity: 0.3,
            background: "radial-gradient(circle, #4A90E2, transparent)",
            animation: "float-slow 20s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: 0,
            width: "20rem",
            height: "20rem",
            borderRadius: "9999px",
            filter: "blur(80px)",
            opacity: 0.25,
            background: "radial-gradient(circle, #FDB913, transparent)",
            animation: "float-medium 15s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "25%",
            left: "33%",
            width: "18rem",
            height: "18rem",
            borderRadius: "9999px",
            filter: "blur(80px)",
            opacity: 0.2,
            background: "radial-gradient(circle, #4A90E2, transparent)",
            animation: "float-fast 12s ease-in-out infinite",
          }}
        />
        <div className="absolute inset-0 opacity-10">
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom right, transparent, rgba(59, 130, 246, 0.2), transparent)",
              animation: "gradient-shift 20s ease-in-out infinite",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: "25%",
            left: "25%",
            width: "0.5rem",
            height: "0.5rem",
            borderRadius: "9999px",
            backgroundColor: "#4A90E2",
            animation: "twinkle 3s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "33%",
            right: "33%",
            width: "0.5rem",
            height: "0.5rem",
            borderRadius: "9999px",
            backgroundColor: "#FDB913",
            animation: "twinkle 3s ease-in-out infinite 1s",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "33%",
            left: "50%",
            width: "0.5rem",
            height: "0.5rem",
            borderRadius: "9999px",
            backgroundColor: "#88B9E6",
            animation: "twinkle 3s ease-in-out infinite 2s",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "66%",
            right: "25%",
            width: "0.5rem",
            height: "0.5rem",
            borderRadius: "9999px",
            backgroundColor: "#4A90E2",
            animation: "twinkle 3s ease-in-out infinite 1.5s",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 md:gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="mb-6">
                  <img
                    src="/web3Nova.svg"
                    alt="Web3Nova Logo"
                    className="h-12 w-auto object-contain"
                  />
                </div>

                <p className="text-gray-400 text-sm mb-6 leading-relaxed font-['Inter']">
                  Empowering the next generation of Web3 builders through
                  world-class education and premium digital solutions.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <Mail className="w-4 h-4 text-[#2B6EFF]" />
                    <span className="font-['Inter']">bernard@web3nova.org</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <Phone className="w-4 h-4 text-[#2B6EFF]" />
                    <span className="font-['Inter']">+234 704 331 4162</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <MapPin className="w-4 h-4 text-[#2B6EFF]" />
                    <span className="font-['Inter']">Akure, Nigeria</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider font-['Space_Grotesk']">
                Academy
              </h3>
              <ul className="space-y-3">
                {footerLinks.academy.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-[#2B6EFF] transition-colors text-sm inline-flex items-center group font-['Inter']"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider font-['Space_Grotesk']">
                Services
              </h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-[#FFC933] transition-colors text-sm inline-flex items-center group font-['Inter']"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider font-['Space_Grotesk']">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center group font-['Inter']"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider font-['Space_Grotesk']">
                Resources
              </h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center group font-['Inter']"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="py-8 border-t border-white/5"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-white font-bold mb-2 text-lg font-['Space_Grotesk']">
                Stay Updated
              </h3>
              <p className="text-gray-400 text-sm font-['Inter']">
                Subscribe to our newsletter for the latest updates and exclusive
                content.
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 bg-white/5 border border-white/10 rounded-l-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#2B6EFF] transition-colors text-sm font-['Inter']"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-[#2B6EFF] to-[#71A6FF] text-white font-semibold rounded-r-xl hover:shadow-lg hover:shadow-[#2B6EFF]/30 transition-all font-['Inter']"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="py-6 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p className="font-['Inter']">
              © {new Date().getFullYear()} Web3Nova. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a
                href="#privacy"
                className="hover:text-white transition-colors font-['Inter']"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="hover:text-white transition-colors font-['Inter']"
              >
                Terms of Service
              </a>
              <a
                href="#cookies"
                className="hover:text-white transition-colors font-['Inter']"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
