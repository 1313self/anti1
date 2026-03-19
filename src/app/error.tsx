"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mb-8 border border-red-100 shadow-sm"
      >
        <AlertCircle className="w-10 h-10 text-red-500" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-4 max-w-md"
      >
        <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-900 leading-none">
          SYSTEM <span className="text-red-500">GLITCH</span>
        </h1>
        <p className="text-slate-500 font-medium">
          Something went wrong while processing your request. Our team has been notified.
        </p>
        
        {error.digest && (
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mt-4">
            <code className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
              ID: {error.digest}
            </code>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            onClick={() => reset()}
            className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl px-8 h-12 font-black uppercase text-xs tracking-widest flex items-center gap-2 grow shadow-lg shadow-indigo-100"
          >
            <RefreshCcw className="w-4 h-4" /> Try Again
          </Button>
          <Link href="/" className="grow">
            <Button
              variant="outline"
              className="w-full rounded-2xl border-slate-200 bg-white hover:bg-slate-50 px-8 h-12 uppercase font-black text-xs tracking-widest text-slate-600"
            >
              <Home className="w-4 h-4 mr-2" /> Back Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
