"use client";

import { motion } from "framer-motion";
import {
    ArrowRight, Users, Library, Terminal, Compass,
    MessageSquare, Briefcase, Zap, Star, UserCircle, LogOut, Sparkles
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StudyBuddyToggle } from "@/components/StudyBuddyToggle";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background p-6 md:p-12 relative overflow-hidden">
            {/* Soft Ambient Light */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/[0.03] blur-[150px] rounded-full pointer-events-none" />

            <main className="max-w-7xl mx-auto space-y-12 relative z-10">
                {/* Dashboard Header */}
                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8 py-4 md:py-8">
                    <div className="space-y-3 md:space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em]"
                        >
                            <Sparkles className="w-3 h-3" />
                            <span>Era Connect Active</span>
                        </motion.div>
                        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase text-slate-900 break-words">
                            Your <span className="text-gradient">Hub</span>
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 md:gap-4">
                        <Link href="/dashboard/profile" className="flex-1 sm:flex-initial">
                            <Button variant="ghost" className="w-full sm:w-auto rounded-2xl border-slate-100 px-4 md:px-6 h-14 md:h-16 uppercase font-black text-[10px] md:text-xs tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                <UserCircle className="w-5 h-5" />
                                <span className="hidden sm:inline">My Profile</span>
                                <span className="sm:hidden">Profile</span>
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            className="rounded-2xl border-slate-100 bg-white hover:bg-slate-100 px-4 md:px-6 h-14 md:h-16 uppercase font-black text-[10px] md:text-xs tracking-widest text-slate-400 hover:text-rose-600 transition-all flex items-center justify-center gap-2"
                            onClick={async () => {
                                await supabase.auth.signOut();
                                window.location.href = "/";
                            }}
                        >
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </header>

                <StudyBuddyToggle />

                {/* Main Grid System */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Discovery Engine - Featured Card */}
                    <div className="md:col-span-2 md:row-span-2">
                        <Link href="/dashboard/discovery" className="block h-full">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="glass-card h-full p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] space-y-6 md:space-y-8 group relative overflow-hidden border-indigo-100/50"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
                                <div className="space-y-3 md:space-y-2 relative z-10">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition-transform shadow-sm">
                                        <Compass className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black uppercase text-slate-800 tracking-tighter pt-2 md:pt-4">Discover <br /> People</h2>
                                    <p className="text-sm md:text-base text-slate-500 font-medium pb-2 md:pb-4">Our engine analyzed your bio and matched you with peer collaborators.</p>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1 w-12 bg-indigo-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-600 w-2/3 animate-pulse" />
                                        </div>
                                        <span className="text-[9px] md:text-[10px] font-black text-indigo-600 uppercase tracking-widest">Optimizing Matches</span>
                                    </div>
                                </div>
                                <div className="pt-2 md:pt-4 relative z-10">
                                    <Button variant="ghost" className="p-0 text-indigo-600 hover:text-indigo-700 hover:bg-transparent transition-all font-black uppercase text-[10px] md:text-xs tracking-widest gap-2">
                                        Go to Discovery <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        </Link>
                    </div>

                    {/* Smaller Feature Cells */}
                    <GridItem
                        icon={<Library className="w-6 h-6 text-blue-600" />}
                        title="Library"
                        desc="Peer Resources"
                        href="/dashboard/library"
                        color="blue"
                    />
                    <GridItem
                        icon={<MessageSquare className="w-6 h-6 text-emerald-600" />}
                        title="Lounge"
                        desc="Campus Pulse"
                        href="/dashboard/lounge"
                        color="emerald"
                    />
                    <GridItem
                        icon={<Terminal className="w-6 h-6 text-amber-600" />}
                        title="The Forge"
                        desc="Start Projects"
                        href="/dashboard/forge"
                        color="amber"
                    />
                    <GridItem
                        icon={<Briefcase className="w-6 h-6 text-rose-600" />}
                        title="The Hustle"
                        desc="Opportunities"
                        href="/dashboard/hustle"
                        color="rose"
                    />
                </div>

                {/* Version Status */}
                <div className="pt-6">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="glass-card p-10 rounded-[2.5rem] bg-white text-slate-900 relative overflow-hidden group border border-rose-100 shadow-2xl shadow-rose-100/20"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/[0.05] to-transparent" />
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 py-2">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                                    Development Mode
                                </div>
                                <div>
                                    <h3 className="text-4xl font-black uppercase tracking-tighter leading-none text-rose-600">Phase 1</h3>
                                    <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] mt-2">(Pilot)</p>
                                </div>
                            </div>

                            <div className="max-w-md">
                                <p className="text-slate-900 text-xs font-bold leading-relaxed uppercase tracking-wide">
                                    This website is under maintenance and is currently open for development purposes only.
                                    Further improvements will include a paid database implementation and email verification.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Professional Developer Notice */}
                <div className="pt-8 pb-12 flex flex-col items-center gap-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-4 px-6 py-4 rounded-3xl bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-2xl hover:shadow-rose-100/20 transition-all duration-500"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform duration-500">
                            <Sparkles className="w-5 h-5 text-rose-600" />
                        </div>
                        <div className="flex flex-col pr-6 border-r border-slate-200">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-rose-600 transition-colors">Engineering</span>
                            <p className="text-[11px] font-bold text-slate-800 uppercase tracking-tight mt-0.5 leading-none">
                                Built with <span className="text-rose-600 font-extrabold">Next.js</span>
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Architect</span>
                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-tighter mt-0.5 leading-none">
                                Divyansh and <span className="text-rose-600">Team</span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}


function GridItem({ icon, title, desc, href, color }: { icon: React.ReactNode, title: string, desc: string, href: string, color: string }) {
    const colorClasses: Record<string, string> = {
        indigo: "bg-indigo-50 border-indigo-100 text-indigo-600",
        blue: "bg-blue-50 border-blue-100 text-blue-600",
        emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
        amber: "bg-amber-50 border-amber-100 text-amber-600",
        rose: "bg-rose-50 border-rose-100 text-rose-600",
    };

    return (
        <Link href={href} className="block group">
            <motion.div
                whileHover={{ y: -5 }}
                className="glass-card p-8 rounded-[2.5rem] h-full space-y-4 flex flex-col justify-between"
            >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm group-hover:scale-110 transition-transform ${colorClasses[color]}`}>
                    {icon}
                </div>
                <div>
                    <h3 className="text-lg font-black uppercase text-slate-800 tracking-tight">{title}</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{desc}</p>
                </div>
            </motion.div>
        </Link>
    );
}
