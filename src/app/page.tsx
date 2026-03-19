"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Users, Library, Terminal, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SplashScreen } from "@/components/SplashScreen";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function LandingPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.1 : 0.15,
        delayChildren: isMobile ? 0.1 : 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? 15 : 30, 
      filter: isMobile ? "none" : "blur(10px)" 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: isMobile ? "none" : "blur(0px)",
      transition: {
        type: isMobile ? "tween" : "spring",
        duration: 0.5,
        damping: 20,
        stiffness: 80,
      }
    },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <SplashScreen />

      {/* Dynamic Background Accents - Simplified on mobile */}
      <motion.div 
        animate={isMobile ? { opacity: 0.05 } : { 
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-5%] right-[-5%] w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full" 
      />
      <motion.div 
        animate={isMobile ? { opacity: 0.05 } : { 
          scale: [1.1, 1, 1.1],
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-5%] left-[-5%] w-[800px] h-[800px] bg-blue-500/5 blur-[120px] rounded-full" 
      />

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 max-w-6xl w-full flex flex-col items-center gap-16"
      >
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/50 text-indigo-600 text-[10px] font-black uppercase tracking-widest shadow-sm"
          >
            <Sparkles className="w-3 h-3" />
            <span>Campus Networking Evolved</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase text-slate-900"
          >
            ERA <br />
            <span className="text-gradient">CONNECT</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-2xl text-slate-500 max-w-2xl font-medium leading-relaxed"
          >
            A premium space for university students to share knowledge, find collaborators, and grow their professional network.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link href="/signup">
              <Button size="lg" className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl px-12 h-16 font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95">
                Join Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="rounded-2xl border-slate-200 bg-white hover:bg-slate-50 px-12 h-16 uppercase font-black text-xs tracking-[0.2em] text-slate-600 shadow-sm transition-all hover:scale-105 active:scale-95">
                Login
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <motion.div
            variants={itemVariants}
            whileHover={isMobile ? {} : { y: -10, transition: { duration: 0.3 } }}
            className="glass-card p-10 rounded-[2.5rem] text-left space-y-5"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
              <Users className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-black uppercase text-slate-800 tracking-tight">Discover Peers</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">Meet students with aligned interests and goals using our precise recommendation engine.</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={isMobile ? {} : { y: -10, transition: { duration: 0.3 } }}
            className="glass-card p-10 rounded-[2.5rem] text-left space-y-5"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
              <Library className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-black uppercase text-slate-800 tracking-tight">The Library</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">Access shared resources and collaborative notes to accelerate your academic journey.</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={isMobile ? {} : { y: -10, transition: { duration: 0.3 } }}
            className="glass-card p-10 rounded-[2.5rem] text-left space-y-5"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm">
              <Terminal className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-black uppercase text-slate-800 tracking-tight">The Forge</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">Initiate projects, build teams, and turn your campus ideas into professional reality.</p>
          </motion.div>
        </div>
      </motion.main>

      <footer className="mt-20 py-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">
        EraConnect &copy; 2026 | Built for Modern Excellence
      </footer>
    </div>
  );
}
