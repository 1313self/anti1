"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare, Send, Sparkles, UserCircle,
    ArrowLeft, Hash, Zap, Heart, Share2, MoreHorizontal,
    Construction
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function LoungePage() {
    return (
        <div className="min-h-screen bg-background p-6 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/[0.03] blur-[120px] rounded-full" />

            <main className="max-w-4xl mx-auto relative z-10 space-y-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 py-4 md:py-8">
                    <div className="space-y-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] p-0 hover:bg-transparent hover:text-indigo-600 transition-all flex items-center gap-2">
                                <ArrowLeft className="w-3 h-3" />
                                Hub Dashboard
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-100 relative overflow-hidden shrink-0">
                                <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-white z-10" />
                                <div className="absolute inset-0 bg-white/10 rotate-45 -translate-y-8" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-slate-900 truncate">The <span className="text-gradient">Lounge</span></h1>
                                <p className="text-slate-400 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold truncate">Campus Pulse Feed</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex flex-col items-center justify-center py-20 text-center space-y-8">
                    <div className="w-32 h-32 rounded-[3rem] bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-2xl shadow-emerald-100/50 animate-pulse">
                        <Construction className="w-16 h-16 text-emerald-600" />
                    </div>

                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em]">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                            System Update In Progress
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">Under <span className="text-emerald-600">Maintenance</span></h2>
                        <p className="text-slate-400 font-bold max-w-md mx-auto text-xs md:text-sm uppercase tracking-widest leading-relaxed">
                            The communication protocols for the Lounge are currently being recalibrated. Real-time campus transmissions will resume shortly.
                        </p>
                    </div>

                    <Link href="/dashboard">
                        <Button className="bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl px-12 h-16 shadow-xl transition-all hover:scale-105 active:scale-95">
                            Return to Dashboard
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 rounded-[2rem] bg-slate-50/50 border border-dashed border-slate-200" />
                    ))}
                </div>
            </main>
        </div>
    );
}
