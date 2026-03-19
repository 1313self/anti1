"use client";

import { motion } from "framer-motion";
import { Search, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-[0.03]">
        <h1 className="text-[30rem] font-black tracking-tighter leading-none select-none">
          404
        </h1>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center mb-8 border border-indigo-100 shadow-sm"
      >
        <Search className="w-10 h-10 text-indigo-600" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-4 max-w-md"
      >
        <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-900 leading-none">
          VOID <br />
          <span className="text-gradient">ENCOUNTERED</span>
        </h1>
        <p className="text-slate-500 font-medium">
          The page you are looking for has been moved or doesn't exist in the current era.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <Link href="/" className="grow">
            <Button
              className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-2xl px-8 h-12 font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-xl shadow-slate-200"
            >
              <Home className="w-4 h-4" /> System Hub
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="rounded-2xl px-8 h-12 uppercase font-black text-xs tracking-widest text-slate-400 hover:text-slate-600 grow"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
