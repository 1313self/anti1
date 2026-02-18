"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users, Library, Terminal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full" />

      <main className="relative z-10 max-w-6xl w-full flex flex-col items-center gap-16">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cyan-500/10"
          >
            New: Campus Networking
          </motion.div>

          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase">
            CONNECT <br />
            <span className="text-gradient">ON CAMPUS</span>
          </h1>

          <p className="text-lg md:text-2xl text-white/40 max-w-2xl font-medium leading-relaxed">
            Find other students at your university. Share notes, collaborate on projects, and build your professional network.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-2xl px-12 h-16 font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all hover:scale-105">
                Join Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="rounded-2xl border-white/10 hover:bg-white/5 px-12 h-16 uppercase font-black text-xs tracking-[0.2em] text-white/60">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="glass-card p-8 rounded-3xl border-white/5 text-left space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <Users className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-black uppercase">Find People</h3>
            <p className="text-white/40 text-sm leading-relaxed">Meet students with similar interests and academic goals using our discovery tools.</p>
          </div>

          <div className="glass-card p-8 rounded-3xl border-white/5 text-left space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Library className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-black uppercase">The Library</h3>
            <p className="text-white/40 text-sm leading-relaxed">Access shared resources, study guides, and project files from your campus network.</p>
          </div>

          <div className="glass-card p-8 rounded-3xl border-white/5 text-left space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Terminal className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-black uppercase">The Forge</h3>
            <p className="text-white/40 text-sm leading-relaxed">Collaborate on projects and launch your ideas with help from the community.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
