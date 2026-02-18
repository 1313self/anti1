"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users, Library, Terminal, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Soft Background Accents */}
      <div className="absolute top-[-5%] right-[-5%] w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full" />

      <main className="relative z-10 max-w-6xl w-full flex flex-col items-center gap-16">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/50 text-indigo-600 text-[10px] font-black uppercase tracking-widest shadow-sm"
          >
            <Sparkles className="w-3 h-3" />
            <span>Campus Networking Evolved</span>
          </motion.div>

          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase text-slate-900">
            ERA <br />
            <span className="text-gradient">CONNECT</span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-500 max-w-2xl font-medium leading-relaxed">
            A premium space for university students to share knowledge, find collaborators, and grow their professional network.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl px-12 h-16 font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-indigo-200 transition-all hover:scale-105">
                Join Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="rounded-2xl border-slate-200 bg-white hover:bg-slate-50 px-12 h-16 uppercase font-black text-xs tracking-[0.2em] text-slate-600 shadow-sm transition-all hover:scale-105">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-10 rounded-[2.5rem] text-left space-y-5"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
              <Users className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-black uppercase text-slate-800 tracking-tight">Discover Peers</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">Meet students with aligned interests and goals using our precise recommendation engine.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-10 rounded-[2.5rem] text-left space-y-5"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
              <Library className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-2xl font-black uppercase text-slate-800 tracking-tight">The Library</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">Access shared resources and collaborative notes to accelerate your academic journey.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-10 rounded-[2.5rem] text-left space-y-5"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm">
              <Terminal className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-black uppercase text-slate-800 tracking-tight">The Forge</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">Initiate projects, build teams, and turn your campus ideas into professional reality.</p>
          </motion.div>
        </div>
      </main>

      <footer className="mt-20 py-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">
        EraConnect &copy; 2026 | Built for Modern Excellence
      </footer>
    </div>
  );
}
